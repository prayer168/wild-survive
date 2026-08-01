(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`無法載入 ${path}`);
    return response.json();
  }

  function initTabs() {
    const tabs = $$('[data-compass-tab]');
    const panels = $$('[data-compass-panel]');
    if (!tabs.length) return;
    const activate = (tab, focus = false) => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => { panel.hidden = panel.dataset.compassPanel !== tab.dataset.compassTab; });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        let target = index;
        if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') target = 0;
        else if (event.key === 'End') target = tabs.length - 1;
        else return;
        event.preventDefault();
        activate(tabs[target], true);
      });
    });
  }

  function initDiyCompass() {
    const buttons = $$('[data-diy-step]');
    const scene = $('#floating-compass');
    const feedback = $('#diy-step-feedback');
    if (!buttons.length || !scene || !feedback) return;
    const steps = [
      ['magnetize', '由成人用磁鐵沿同一方向摩擦鋼針，使它暫時磁化。'],
      ['float', '由成人把磁針固定在輕薄浮材上，輕放水面中央，不碰盤緣。'],
      ['settle', '等待水面完全平靜；不要吹氣、推動浮材或用手調整方向。'],
      ['compare', '用正式指北針或已知方向比對，標記哪一端指向大致磁北；重做數次確認。']
    ];
    let current = 0;
    let timer = null;
    const show = (index) => {
      current = index;
      scene.dataset.state = steps[index][0];
      scene.setAttribute('aria-label', steps[index][1]);
      feedback.textContent = steps[index][1];
      buttons.forEach((button, buttonIndex) => button.classList.toggle('is-active', buttonIndex === index));
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    buttons.forEach((button) => button.addEventListener('click', () => { stop(); show(Number(button.dataset.diyStep)); }));
    $('#diy-play')?.addEventListener('click', () => {
      stop();
      timer = setInterval(() => {
        if (current >= steps.length - 1) { stop(); return; }
        show(current + 1);
      }, 1800);
    });
    $('#diy-pause')?.addEventListener('click', stop);
    $('#diy-reset')?.addEventListener('click', () => { stop(); show(0); });
    show(0);
  }

  function initInterference() {
    const buttons = $$('[data-interference]');
    const needle = $('#sim-compass-needle');
    const feedback = $('#interference-feedback');
    if (!buttons.length || !needle || !feedback) return;
    const states = {
      clear: [0, '周圍淨空後，磁針可較穩定地指向磁北。讀值前仍要等磁針停止擺動。'],
      phone: [28, '手機的磁性零件與電子元件可能讓讀值偏轉；移開後重新測量。'],
      steel: [-42, '含鐵鋼製物品可能吸引磁針。離開金屬欄杆、車輛、鋼瓶與裝備扣件再讀值。'],
      magnet: [105, '強磁鐵會明顯壓過地磁影響，這個讀值不可用來辨位。']
    };
    const show = (key) => {
      needle.style.setProperty('--needle-angle', `${states[key][0]}deg`);
      feedback.textContent = states[key][1];
      buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.interference === key));
    };
    buttons.forEach((button) => button.addEventListener('click', () => show(button.dataset.interference)));
    $('#interference-reset')?.addEventListener('click', () => show('clear'));
    show('clear');
  }

  function initMapOrientation() {
    const slider = $('#map-rotation');
    const sheet = $('#map-sheet');
    const output = $('#map-angle');
    const feedback = $('#map-feedback');
    if (!slider || !sheet || !output || !feedback) return;
    const update = () => {
      const angle = Number(slider.value);
      sheet.style.setProperty('--map-angle', `${angle}deg`);
      output.value = `${angle}°`;
      const offset = Math.abs(angle);
      if (offset <= 5) {
        sheet.classList.add('is-aligned');
        sheet.setAttribute('aria-label', '地圖北方已與磁針北端對齊');
        feedback.textContent = '對齊了！接著仍要核對至少兩個實際地形或地標，不能只靠角度。';
      } else {
        sheet.classList.remove('is-aligned');
        sheet.setAttribute('aria-label', `地圖仍偏轉約 ${offset} 度`);
        feedback.textContent = offset < 25 ? '很接近，再微調到北箭頭與磁針北端平行且同向。' : '地圖尚未定向；只轉身、不轉地圖，會讓左右關係混亂。';
      }
    };
    slider.addEventListener('input', update);
    $('#map-reset')?.addEventListener('click', () => { slider.value = '125'; update(); });
    update();
  }

  async function initTechniques() {
    const grid = $('#technique-grid');
    const category = $('#technique-category');
    const reliability = $('#technique-reliability');
    if (!grid || !category || !reliability) return;
    try {
      const techniques = await loadJson('data/navigation-techniques.json');
      [...new Set(techniques.map((item) => item.category))].forEach((name) => {
        category.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`);
      });
      const render = () => {
        const filtered = techniques.filter((item) => {
          const categoryMatch = category.value === 'all' || item.category === category.value;
          const reliabilityMatch = reliability.value === 'all' || (reliability.value === '低' ? item.reliability.startsWith('低') : item.reliability === reliability.value);
          return categoryMatch && reliabilityMatch;
        });
        grid.innerHTML = filtered.map((item) => `
          <article>
            <div class="technique-meta"><span>${escapeHtml(item.category)}</span><b>可靠度：${escapeHtml(item.reliability)}</b></div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.principle)}</p>
            <dl><div><dt>適用</dt><dd>${escapeHtml(item.environment)}</dd></div><div><dt>限制</dt><dd>${escapeHtml(item.limits)}</dd></div><div><dt>安全用法</dt><dd>${escapeHtml(item.safeUse)}</dd></div></dl>
            <a href="${escapeHtml(item.source.url)}" target="_blank" rel="noopener noreferrer">來源：${escapeHtml(item.source.name)} ↗</a>
          </article>`).join('') || '<p class="empty-state">目前沒有符合條件的方法，請調整篩選。</p>';
      };
      category.addEventListener('change', render);
      reliability.addEventListener('change', render);
      render();
    } catch (error) {
      grid.innerHTML = '<p class="load-error">辨位方法資料暫時無法載入。請使用本機伺服器開啟網站。</p>';
      console.error(error);
    }
  }

  function initClueEvaluator() {
    const form = $('#clue-form');
    const feedback = $('#clue-feedback');
    if (!form || !feedback) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const scenario = $('#clue-scenario').value;
      const evidence = $('#clue-evidence').value;
      if (evidence === 'cross') {
        feedback.textContent = '較可靠：工具與地標互相驗證。若結果矛盾，先停下，不要挑一個自己喜歡的答案繼續走。';
      } else if (evidence === 'sun' && scenario === 'clear-day') {
        feedback.textContent = '只能概略輔助：太陽位置受時間、季節與地形影響，仍須用地圖、指北針和地標確認。';
      } else if (evidence === 'gps') {
        feedback.textContent = '不可單獨依賴：GPS 可提供座標，但可能沒電、受遮蔽或地圖未離線；必須保留紙圖與指北針。';
      } else if (evidence === 'moss') {
        feedback.textContent = '不可靠：青苔分布受濕度、遮蔭與樹皮條件影響，不能固定代表北方。';
      } else {
        feedback.textContent = '這個情境看不到所選線索，不能據此決定行進方向。先停下並改用可交叉確認的工具。';
      }
    });
  }

  function initLostOrder() {
    const pool = $('#lost-step-pool');
    const order = $('#lost-step-order');
    const feedback = $('#lost-step-feedback');
    if (!pool || !order || !feedback) return;
    const steps = [
      ['stop', '停止前進，集合隊伍'],
      ['observe', '回想最後已知位置，核對地圖、座標與地標'],
      ['protect', '選安全處避風雨、保暖並節省電力'],
      ['contact', '通知成人／管理單位；緊急時撥 119 並留在可被找到處']
    ];
    const selected = [];
    const render = () => {
      pool.innerHTML = steps.filter(([id]) => !selected.includes(id)).map(([id, label]) => `<button type="button" data-lost-step="${id}">${label}</button>`).join('');
      order.innerHTML = selected.map((id) => `<li>${steps.find(([stepId]) => stepId === id)[1]}</li>`).join('');
      $$('[data-lost-step]', pool).forEach((button) => button.addEventListener('click', () => {
        const expected = steps[selected.length][0];
        if (button.dataset.lostStep !== expected) {
          feedback.textContent = selected.length === 0 ? '第一步不是繼續找路：先停止前進並集合隊伍。' : '這一步太早了；先完成前面的定位與基本安全處置。';
          return;
        }
        selected.push(button.dataset.lostStep);
        feedback.textContent = selected.length === steps.length ? '順序正確：停止擴大錯誤、確認資訊、維持安全，再清楚求援並等待。' : `已完成第 ${selected.length} 步，繼續選擇。`;
        render();
      }));
    };
    $('#lost-step-reset')?.addEventListener('click', () => { selected.length = 0; feedback.textContent = '先停下來，避免在不確定方向時越走越遠。'; render(); });
    render();
  }

  initTabs();
  initDiyCompass();
  initInterference();
  initMapOrientation();
  initTechniques();
  initClueEvaluator();
  initLostOrder();
})();
