# 野外求生安全手冊

一個以臺灣山林情境為核心的純閱讀型戶外安全網站，整理行前準備、迷途待援、有毒植物、用火、飲水、方位、禦寒、野生動物與基礎急救原則。

## 適用對象

國小五年級至國中低年級、親子家庭、戶外活動初學者。網站內容用於安全教育，不能取代實體技能訓練、當地法規、專業領隊、急救課程或緊急救援指示。

## 教材特色

- 以臺灣常見情境與官方資料為主，搭配國際權威機構資料交叉查核。
- 把「預防、停下、定位、求援」放在鑽木取火或野外覓食之前。
- 明確標示不可做的危險迷思，例如試吃不明植物、飲用未處理溪水、任意生火、被蛇咬後切開吸毒。
- 全站章節圖片由 Image 2.0 生成，未抓取網路照片。
- 純 HTML/CSS，無測驗、動畫、追蹤器或學習進度儲存。
- 支援手機、平板、桌機與列印。

## 本機開啟

直接開啟 `index.html`，或在專案目錄執行：

```bash
python -m http.server 8080
```

然後前往 `http://localhost:8080/`。

## 專案結構

```text
wild_survive/
├─ index.html
├─ css/style.css
├─ assets/images/
├─ docs/references.md
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
