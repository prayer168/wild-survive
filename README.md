# 野外求生安全手冊

一個以臺灣山林情境為核心的戶外安全網站，整理行前準備、迷途待援、有毒植物、用火、飲水、方位、禦寒、野生動物與基礎急救原則，並在不改動其他主題內容的前提下，新增完整的安全生火互動教材。

## 適用對象

國小五年級至國中低年級、親子家庭、戶外活動初學者。網站內容用於安全教育，不能取代實體技能訓練、當地法規、專業領隊、急救課程或緊急救援指示。

## 教材特色

- 以臺灣常見情境與官方資料為主，搭配國際權威機構資料交叉查核。
- 把「預防、停下、定位、求援」放在鑽木取火或野外覓食之前。
- 明確標示不可做的危險迷思，例如試吃不明植物、飲用未處理溪水、任意生火、被蛇咬後切開吸毒。
- 原有 14 張教材圖片與新增 20 張生火教材圖像均由 Image 2.0 生成，未抓取網路照片；完整生火圖像提示詞收錄於 `docs/image-prompts.md`。
- 新增 5 個生火互動頁籤：火三角、15 種方法比較、環境判斷、用火安全與圖像探索。
- 新增拖曳／點選排序、找錯、完全滅火排序、火焰模擬與 20 題素養導向闖關。
- 自主學習區新增 14 筆野外求生與安全生火官方影音、網站及文章。
- 使用原生 HTML、CSS、JavaScript 與 JSON，無追蹤器、不自動播放聲音。
- 支援手機、平板、桌機與列印。

## 本機開啟

互動資料使用 JSON 載入，請在專案目錄啟動本機伺服器：

```bash
python -m http.server 8080
```

然後前往 `http://localhost:8080/`。

## 專案結構

```text
wild_survive/
├─ index.html
├─ css/style.css
├─ js/fire-learning.js
├─ data/
│  ├─ fire-methods.json
│  ├─ resources.json
│  └─ quiz.json
├─ assets/images/
│  └─ fire/                # 20 張 Image 2.0 生火教材圖
├─ docs/references.md
├─ docs/image-generation.md
├─ docs/image-prompts.md
├─ docs/teacher-guide.md
├─ docs/test-report.md
├─ project.config.json
└─ CHANGELOG.md
```

## 內容與授權

文字為依公開權威資料重新整理的教育內容；完整來源與查核日期見 `docs/references.md`。生成圖片僅用於本專案教材呈現。第三方網站與資料仍依各來源之授權條款使用。

## 部署

- Repository：https://github.com/prayer168/wild-survive
- GitHub Pages：https://prayer168.github.io/wild-survive/
