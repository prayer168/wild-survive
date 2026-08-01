(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);

  const imageAssets = [
    ['hero-cover.png', '安全生火學習封面', '成人在合法營地監督兩名學生觀察小型營火，旁邊備有水桶與鏟子'],
    ['fire-triangle.png', '燃燒三要素', '小型受控營火與可供標示燃料、熱、氧氣的三個視覺區域'],
    ['fuel-levels.png', '燃料尺寸分級', '引火物、細柴與燃料柴由細到粗分組排列'],
    ['tinder-bundle.png', '乾燥引火束', '乾草、樹皮纖維與細木屑組成的乾燥引火束'],
    ['feather-stick.png', '羽毛棒', '乾木削成許多仍連在木棒上的薄木片'],
    ['stormproof-matches.png', '防風火柴與防水收納', '防風火柴、防水盒與乾燥引火材料的設備展示'],
    ['ferro-rod.png', '火鋼棒安全示範', '成人在金屬托盤上操作火鋼棒，火花朝向乾燥引火物'],
    ['magnesium-block.png', '鎂棒與刮片', '鎂塊、火鋼與專用刮片的受控設備展示'],
    ['solar-lens.png', '放大鏡聚光', '成人在金屬托盤上示範凸透鏡聚光，水桶就在旁邊'],
    ['bow-drill.png', '弓鑽取火設備', '弓、弦、鑽軸、火板與承壓塊的分解配置'],
    ['hand-drill.png', '手鑽取火', '成人示範手鑽姿勢與乾燥材料配置'],
    ['fire-plough.png', '火犁法', '火犁推桿、木槽與引火束的設備示意'],
    ['weather-conditions.png', '五種戶外環境', '晴天、下雨、潮濕、強風與寒冷的五格戶外情境'],
    ['legal-campsite.png', '合法安全營火場地', '既有金屬火圈、清理過的地面、水桶、鏟子與成人監督'],
    ['hazard-campsite.png', '安全營地找錯題', '包含帳篷太近、火星飛散、枯草、水桶過遠與無人看守等錯誤的營地'],
    ['extinguish-steps.png', '完全滅火步驟', '成人依序澆水、攪拌、再次澆水並確認完全冷卻'],
    ['leave-no-trace.png', '無痕山林', '完成活動後恢復整潔、無火痕且垃圾全數帶走的營地'],
    ['wind-no-fire.png', '強風時不生火', '成人帶學生改用乾衣、睡袋、地墊與防風遮蔽保暖'],
    ['rain-dry-storage.png', '雨天防水收納', '在雨棚下用雙層防水容器保存乾燥引火材料'],
    ['challenge-badge.png', '闖關完成圖', '安全盾牌、森林與小型受控營火構成的無文字學習成就圖']
  ];

  function initTabs() {
    const tabs = $$('[data-fire-tab]');
    const panels = $$('[data-fire-panel]');
    if (!tabs.length) return;

    const activate = (tab) => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.firePanel !== tab.dataset.fireTab;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        tabs[next].focus();
        activate(tabs[next]);
      });
    });
  }

  function initTriangle() {
    const feedback = $('#triangle-feedback');
    const descriptions = {
      fuel: '燃料是能燃燒的物質；越乾、越細，通常越容易被加熱到燃點。',
      heat: '熱把燃料升溫到燃點；水能吸收熱，使火焰冷卻。',
      oxygen: '空氣提供氧氣；燃料排得太密會阻礙空氣流動。'
    };
    $$('[data-element]').forEach((button) => button.addEventListener('click', () => {
      $$('[data-element]').forEach((item) => item.classList.toggle('is-active', item === button));
      feedback.textContent = descriptions[button.dataset.element];
    }));
  }

  function initSimulator() {
    const scene = $('#simulator-scene');
    if (!scene) return;
    const feedback = $('#simulator-feedback');
    const status = $('.sim-status', scene);
    const messages = {
      fuel: '移除燃料後，沒有物質能繼續燃燒，火焰逐漸熄滅。',
      oxygen: '氧氣不足時，燃燒無法維持；實際火場不可用身體靠近嘗試隔絕空氣。',
      heat: '降低溫度後，燃料低於燃點，火焰熄滅。水的主要作用就是吸收熱。'
    };
    const reset = () => {
      scene.classList.remove('is-out', 'is-paused', 'reduced-motion');
      scene.setAttribute('aria-label', '目前火焰穩定燃燒');
      status.textContent = '三要素齊全';
      feedback.textContent = '請先預測，再選擇要移除的要素。';
      $$('[data-remove]').forEach((button) => button.disabled = false);
      $$('input[name="fire-prediction"]').forEach((input) => input.checked = false);
    };
    $$('[data-remove]').forEach((button) => button.addEventListener('click', () => {
      scene.classList.add('is-out');
      scene.setAttribute('aria-label', '缺少燃燒要素，火焰已熄滅');
      status.textContent = `已移除${button.textContent.replace('移除', '').replace('減少', '').replace('降低', '')}`;
      const prediction = $('input[name="fire-prediction"]:checked');
      feedback.textContent = `${prediction?.value === 'correct' ? '預測正確！' : prediction ? '再想一想：' : ''}${messages[button.dataset.remove]}`;
      $$('[data-remove]').forEach((item) => item.disabled = true);
    }));
    $('#sim-play')?.addEventListener('click', () => scene.classList.remove('is-paused'));
    $('#sim-pause')?.addEventListener('click', () => scene.classList.add('is-paused'));
    $('#sim-reset')?.addEventListener('click', reset);
    $('#sim-motion')?.addEventListener('click', (event) => {
      const reduced = scene.classList.toggle('reduced-motion');
      event.currentTarget.setAttribute('aria-pressed', String(reduced));
      event.currentTarget.textContent = reduced ? '恢復動畫' : '降低動畫';
    });
  }

  async function loadJson(path) {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return response.json();
  }

  function rating(value) {
    return `<span class="rating" aria-label="5 分中 ${value} 分">${'●'.repeat(value)}${'○'.repeat(5 - value)}</span>`;
  }

  async function initMethods() {
    const grid = $('#method-grid');
    if (!grid) return;
    try {
      const methods = await loadJson('data/fire-methods.json');
      const category = $('#method-category');
      [...new Set(methods.map((method) => method.category))].forEach((name) => {
        category.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`);
      });

      const render = () => {
        const selected = category.value;
        const sort = $('#method-sort').value;
        const visible = methods
          .filter((method) => selected === 'all' || method.category === selected)
          .sort((a, b) => {
            if (sort === 'name') return a.name.localeCompare(b.name, 'zh-Hant');
            if (sort === 'difficulty') return a.difficulty - b.difficulty;
            return b[sort] - a[sort];
          });
        grid.innerHTML = visible.map((method) => `
          <article class="method-card">
            <img src="${escapeHtml(method.image)}" alt="${escapeHtml(method.name)}的教學圖像" width="1536" height="1024" loading="lazy">
            <div class="method-card-body">
              <span class="tag">${escapeHtml(method.category)}</span>
              <h4>${escapeHtml(method.name)}</h4>
              <p>${escapeHtml(method.principle)}</p>
              <dl class="method-ratings">
                <div><dt>安全性</dt><dd>${rating(method.safety)}</dd></div>
                <div><dt>可靠度</dt><dd>${rating(method.reliability)}</dd></div>
                <div><dt>難度</dt><dd>${rating(method.difficulty)}</dd></div>
              </dl>
              <details>
                <summary>查看完整比較</summary>
                <dl class="method-details">
                  <div><dt>材料</dt><dd>${escapeHtml(method.materials)}</dd></div>
                  <div><dt>適用環境</dt><dd>${escapeHtml(method.environment)}</dd></div>
                  <div><dt>乾燥要求</dt><dd>${escapeHtml(method.dryness)}</dd></div>
                  <div><dt>成功因素</dt><dd>${escapeHtml(method.successFactors)}</dd></div>
                  <div><dt>優點</dt><dd>${escapeHtml(method.advantages)}</dd></div>
                  <div><dt>限制</dt><dd>${escapeHtml(method.limits)}</dd></div>
                  <div><dt>主要危險</dt><dd>${escapeHtml(method.hazard)}</dd></div>
                  <div><dt>學生實作</dt><dd>${escapeHtml(method.student)}</dd></div>
                  <div><dt>成人監督</dt><dd>${escapeHtml(method.adult)}</dd></div>
                  <div><dt>環境影響</dt><dd>${escapeHtml(method.impact)}</dd></div>
                </dl>
                <a href="${escapeHtml(method.source)}" target="_blank" rel="noopener noreferrer">查看可信來源 ↗</a>
              </details>
            </div>
          </article>`).join('');
      };
      category.addEventListener('change', render);
      $('#method-sort').addEventListener('change', render);
      render();
    } catch (error) {
      grid.innerHTML = `<p class="load-error">方法資料暫時無法載入。請以本機伺服器開啟網站，或稍後重試。</p>`;
      console.error(error);
    }
  }

  function initFuelSort() {
    const pool = $('#fuel-sort-pool');
    const target = $('#fuel-sort-target');
    if (!pool || !target) return;
    const items = [
      { id: 'tinder', label: '引火物' },
      { id: 'kindling', label: '細柴' },
      { id: 'fuel', label: '燃料柴' }
    ];
    let order = [];

    const check = () => {
      if (order.length < 3) return;
      const correct = order.join(',') === 'tinder,kindling,fuel';
      $('#fuel-sort-feedback').textContent = correct
        ? '排序正確！細小乾燥的材料先接火，再逐步加入較粗燃料。'
        : '順序還可以調整：先從最容易點燃、表面積最大的材料開始。';
    };
    const add = (id) => {
      if (order.includes(id)) return;
      order.push(id);
      const item = items.find((entry) => entry.id === id);
      target.insertAdjacentHTML('beforeend', `<li data-id="${id}">${order.length}. ${item.label}</li>`);
      $(`[data-sort-id="${id}"]`, pool)?.setAttribute('disabled', '');
      check();
    };
    const reset = () => {
      order = [];
      target.innerHTML = '';
      pool.innerHTML = shuffle(items).map((item) => `<button type="button" draggable="true" data-sort-id="${item.id}">${item.label}</button>`).join('');
      $$('[data-sort-id]', pool).forEach((button) => {
        button.addEventListener('click', () => add(button.dataset.sortId));
        button.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/plain', button.dataset.sortId));
      });
      $('#fuel-sort-feedback').textContent = '提示：先從最細、最容易點燃的材料開始。';
    };
    target.addEventListener('dragover', (event) => event.preventDefault());
    target.addEventListener('drop', (event) => {
      event.preventDefault();
      add(event.dataTransfer.getData('text/plain'));
    });
    $('#fuel-sort-reset').addEventListener('click', reset);
    reset();
  }

  function initWeather() {
    const form = $('#weather-form');
    if (!form) return;
    const environment = {
      sunny: { score: 2, message: '晴天有利於乾燥材料，但仍須查禁火公告與乾旱風險。' },
      rain: { score: -2, message: '雨天材料容易受潮，生火可靠度低；優先使用遮蔽與保暖裝備。' },
      damp: { score: -1, message: '潮濕會吸收熱能，微小餘燼很容易熄滅。' },
      wind: { score: -6, message: '強風會帶走火星並使火勢失控：不生火。' },
      cold: { score: 0, message: '寒冷不代表必須生火；先處理乾衣、隔風、地墊與睡袋。' }
    };
    const material = {
      'dry-grass': { score: 2, message: '乾草容易點燃，也最容易造成火星與延燒。' },
      'wet-twig': { score: -3, message: '濕樹枝需要大量熱能，且會產生更多煙。' },
      bark: { score: 2, message: '細乾纖維表面積大，但來源必須合法。' },
      feather: { score: 2, message: '羽毛棒能利用木材較乾的內層，但刀具由成人操作。' },
      ferro: { score: 3, message: '火鋼耐水但只提供火花；乾燥引火物仍是關鍵。' }
    };
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const env = environment[$('#weather-select').value];
      const mat = material[$('#material-select').value];
      const permitted = $('#permission-check').checked;
      const result = $('#weather-result');
      if (!permitted) {
        result.className = 'weather-result is-stop';
        result.innerHTML = '<strong>停止：不可用火。</strong><span>尚未確認合法場地、成人監督與滅火設備，其他條件再好也不能開始。</span>';
        return;
      }
      const score = env.score + mat.score;
      const stop = $('#weather-select').value === 'wind' || score < 0;
      result.className = `weather-result ${stop ? 'is-stop' : score < 4 ? 'is-caution' : 'is-ready'}`;
      result.innerHTML = `<strong>${stop ? '不建議用火' : score < 4 ? '條件不穩定' : '僅代表較有可能點著'}</strong><span>${escapeHtml(env.message)} ${escapeHtml(mat.message)} 即使條件良好，也只能在合法指定場地由成人決定。</span>`;
    });
  }

  function initHazards() {
    const feedback = $('#hazard-feedback');
    if (!feedback) return;
    const hazards = {
      tent: ['帳篷離火太近', '把帳篷、背包與其他可燃物移到火圈上風且足夠遠的位置。'],
      spark: ['強風吹散火星', '風勢不穩就取消用火，不能只靠擋風。'],
      grass: ['枯草未清除', '合法場地也要使用既有火圈，周圍保持清潔、無可燃物。'],
      water: ['滅火工具太遠', '水桶與鏟子必須放在負責成人伸手可取的位置。'],
      unattended: ['火堆無人看守', '火源必須由成人持續看守，任何人離開前都要完全熄滅。']
    };
    const found = new Set();
    $$('[data-hazard]').forEach((button) => button.addEventListener('click', () => {
      found.add(button.dataset.hazard);
      button.classList.add('is-found');
      const [title, fix] = hazards[button.dataset.hazard];
      feedback.innerHTML = `<strong>${escapeHtml(title)}</strong>：${escapeHtml(fix)}（已找到 ${found.size}／5）`;
    }));
  }

  function initExtinguish() {
    const pool = $('#extinguish-pool');
    const orderList = $('#extinguish-order');
    if (!pool || !orderList) return;
    const steps = [
      ['water1', '澆入足量清水'],
      ['stir', '攪拌灰燼與餘燼'],
      ['water2', '再次澆水'],
      ['check', '檢查熱氣與火星'],
      ['cold', '確認完全冷卻']
    ];
    let order = [];
    const reset = () => {
      order = [];
      orderList.innerHTML = '';
      pool.innerHTML = shuffle(steps).map(([id, label]) => `<button type="button" data-step="${id}">${label}</button>`).join('');
      $$('[data-step]', pool).forEach((button) => button.addEventListener('click', () => {
        if (order.includes(button.dataset.step)) return;
        order.push(button.dataset.step);
        button.disabled = true;
        orderList.insertAdjacentHTML('beforeend', `<li>${button.textContent}</li>`);
        if (order.length === steps.length) {
          const correct = order.join(',') === steps.map(([id]) => id).join(',');
          $('#extinguish-feedback').textContent = correct
            ? '順序正確！若仍感到溫熱，就要重新澆水與攪拌，不能離開。'
            : '還沒完全正確：先澆水，再攪拌讓水接觸所有餘燼，然後重複冷卻與檢查。';
        }
      }));
      $('#extinguish-feedback').textContent = '只要還有熱氣、火星或溫度，就不能離開。';
    };
    $('#extinguish-reset').addEventListener('click', reset);
    reset();
  }

  function initGallery() {
    const gallery = $('#fire-gallery');
    if (!gallery) return;
    gallery.innerHTML = imageAssets.map(([file, title, alt], index) => `
      <figure>
        <img src="assets/images/fire/${file}" alt="${escapeHtml(alt)}" width="1536" height="1024" loading="lazy">
        <figcaption><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(title)}</strong></figcaption>
      </figure>`).join('');
  }

  async function initResources() {
    const list = $('#fire-resource-list');
    if (!list) return;
    try {
      const resources = await loadJson('data/resources.json');
      let topic = 'all';
      let format = 'all';
      const render = () => {
        const filtered = resources.filter((resource) => {
          const resourceTopic = resource.topic || '安全生火';
          const topicMatch = topic === 'all' || resourceTopic === topic;
          const isVideo = resource.type.includes('影音') || resource.type.includes('影片');
          const formatMatch = format === 'all' || (format === '影音' ? isVideo : !isVideo);
          return topicMatch && formatMatch;
        });
        list.innerHTML = filtered.map((resource) => `
          <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">
            <span>${escapeHtml(resource.topic || '安全生火')} · ${escapeHtml(resource.type)} · ${escapeHtml(resource.language)}</span>
            <strong>${escapeHtml(resource.title)}</strong>
            <p>${escapeHtml(resource.summary)}</p>
            <small>${escapeHtml(resource.publisher)}｜${escapeHtml(resource.duration)}｜查核 ${escapeHtml(resource.checkedAt)}${resource.adult ? '｜建議成人陪同' : ''}</small>
            <b aria-hidden="true">↗</b>
          </a>`).join('') || '<p class="empty-state">目前沒有符合這組分類的資源，請調整篩選條件。</p>';
      };
      $$('[data-resource-topic]').forEach((button) => button.addEventListener('click', () => {
        topic = button.dataset.resourceTopic;
        $$('[data-resource-topic]').forEach((item) => item.classList.toggle('is-active', item === button));
        render();
      }));
      $$('[data-resource-format]').forEach((button) => button.addEventListener('click', () => {
        format = button.dataset.resourceFormat;
        $$('[data-resource-format]').forEach((item) => item.classList.toggle('is-active', item === button));
        render();
      }));
      render();
    } catch (error) {
      list.innerHTML = '<p class="load-error">新增資源暫時無法載入，請使用本機伺服器開啟網站。</p>';
      console.error(error);
    }
  }

  async function initQuiz() {
    const card = $('#quiz-card');
    if (!card) return;
    try {
      const quiz = await loadJson('data/quiz.json');
      const storageKey = 'wild_survive_safety_quiz_v2';
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { saved = null; }
      let index = Number.isInteger(saved?.index) && saved.index >= 0 && saved.index < quiz.length ? saved.index : 0;
      let score = Number.isFinite(saved?.score) && saved.score >= 0 ? saved.score : 0;
      let answered = false;
      const next = $('#quiz-next');
      const restart = $('#quiz-restart');

      const render = () => {
        const item = quiz[index];
        answered = false;
        next.disabled = true;
        next.hidden = false;
        restart.hidden = true;
        $('#quiz-progress-text').textContent = `第 ${index + 1}／${quiz.length} 題`;
        $('#quiz-progress').max = quiz.length;
        $('#quiz-progress').value = index + 1;
        $('#quiz-score').textContent = `目前 ${score} 分`;
        card.innerHTML = `
          <p class="quiz-number">QUESTION ${String(index + 1).padStart(2, '0')}<span class="quiz-topic">${escapeHtml(item.category || '安全生火')}</span></p>
          <h3>${escapeHtml(item.question)}</h3>
          <div class="quiz-options" role="group" aria-label="題目選項">
            ${item.options.map((option, optionIndex) => `<button type="button" data-option="${optionIndex}"><span>${String.fromCharCode(65 + optionIndex)}</span>${escapeHtml(option)}</button>`).join('')}
          </div>
          <div id="quiz-feedback" class="quiz-feedback" aria-live="polite"></div>`;
        $$('[data-option]', card).forEach((button) => button.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const selected = Number(button.dataset.option);
          const correct = selected === item.answer;
          if (correct) score += 5;
          $$('[data-option]', card).forEach((option) => {
            option.disabled = true;
            if (Number(option.dataset.option) === item.answer) option.classList.add('is-correct');
            if (option === button && !correct) option.classList.add('is-wrong');
          });
          $('#quiz-score').textContent = `目前 ${score} 分`;
          $('#quiz-feedback').innerHTML = `<strong>${correct ? '答對了！' : '這題再想一想。'}</strong><p>${escapeHtml(item.explanation)}</p><p><b>常見迷思：</b>${escapeHtml(item.myth)}</p><a href="#${escapeHtml(item.review)}">回看相關教材</a>`;
          next.disabled = false;
          if (index === quiz.length - 1) next.textContent = '查看結果';
        }));
      };

      const showResult = () => {
        const percent = Math.round((score / (quiz.length * 5)) * 100);
        let suggestion = '建議回看燃燒三要素、完全滅火、指南針干擾與迷途決策。';
        if (percent >= 90) suggestion = '你已能把安全、交叉確認與環境判斷放在技巧之前。';
        else if (percent >= 70) suggestion = '觀念已很穩固，再複習生火與辨位的限制條件就更完整。';
        card.innerHTML = `<div class="quiz-result"><img src="assets/images/navigation/navigation-badge.png" alt="指南針、地圖、安全盾牌與小型受控營火構成的野外安全學習成就圖" width="1536" height="1024"><p class="quiz-number">CHALLENGE COMPLETE</p><h3>${score}／${quiz.length * 5} 分</h3><p>${escapeHtml(suggestion)}</p><p>完成闖關不代表取得自行生火或獨自進入野外的許可；實地活動仍須由合格成人帶領。</p></div>`;
        next.hidden = true;
        restart.hidden = false;
      };

      next.addEventListener('click', () => {
        if (!answered) return;
        if (index === quiz.length - 1) {
          localStorage.setItem(storageKey, JSON.stringify({ index, score, completed: true }));
          showResult();
        } else {
          index += 1;
          localStorage.setItem(storageKey, JSON.stringify({ index, score }));
          render();
        }
      });
      restart.addEventListener('click', () => {
        index = 0; score = 0; localStorage.removeItem(storageKey); next.textContent = '下一題'; render();
      });
      if (saved?.completed) showResult();
      else render();
    } catch (error) {
      card.innerHTML = '<p class="load-error">闖關題庫暫時無法載入。請使用本機伺服器開啟網站。</p>';
      console.error(error);
    }
  }

  initTabs();
  initTriangle();
  initSimulator();
  initMethods();
  initFuelSort();
  initWeather();
  initHazards();
  initExtinguish();
  initGallery();
  initResources();
  initQuiz();
})();
