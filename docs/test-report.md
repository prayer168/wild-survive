# 品質檢核報告

檢核日期：2026-07-28

## 檢查環境

- Python 靜態伺服器：`http://127.0.0.1:4174/`
- Chromium 桌機視窗：1440 × 1000
- Chromium 平板視窗：768 × 1024
- Chromium 手機視窗：390 × 844

## 檢查結果

- [x] HTML 可載入且有完整語意內容，共 13 個主要區塊。
- [x] 14 張教材圖片與 1 張社群預覽圖皆能載入；教材圖片具有替代文字且只使用專案相對路徑。
- [x] 七個重點段落均新增一張 1536×1024 無文字 Image 2.0 情境圖，原有文字卡完整保留並附圖說。
- [x] 新增圖片以 WebP 呈現，桌機顯示比例為 3:2，沒有被 HTML 原始尺寸拉長。
- [x] 桌機版 1440px 沒有水平溢出；主視覺、文字與導覽未遮擋。
- [x] 平板版 768px 沒有水平溢出；導覽與主視覺正常顯示。
- [x] 手機版 390px 沒有水平溢出；章節圖完整、卡片改為單欄。
- [x] 章節導覽、緊急處置、STOP 與資料來源錨點均有對應目標。
- [x] 瀏覽器無錯誤覆蓋、無主控台錯誤。
- [x] 有鍵盤焦點樣式與「跳到主要內容」連結。
- [x] CSS 支援 `prefers-reduced-motion` 與列印版。
- [x] 外部自主學習連結皆使用 HTTPS 與安全的新視窗設定。
- [x] 無 JavaScript、追蹤器、金鑰與外部圖片依賴。
- [x] 所有本機資源使用相對路徑，相容 GitHub Pages 子路徑。
- [x] 社群預覽圖尺寸為精確 1200 × 630，已目視檢查標題、人物、對比與安全區。
- [x] canonical、Open Graph 與 Twitter Card 均使用 `https://prayer168.github.io/wild-survive/` 絕對網址。

## 視覺證據

- `desktop-check.png`：桌機首頁
- `tablet-check.png`：平板首頁
- `mobile-top.png`：手機首頁
- `mobile-section.png`：手機章節銜接
- `qa-stop.jpg`：STOP 情境圖與原文字卡（桌機）
- `qa-plants.jpg`：有毒植物情境圖與原文字卡（桌機）
- `qa-fire.jpg`：營火結構情境圖與原文字卡（桌機）
- `qa-water.jpg`：水處理步驟情境圖與原文字卡（桌機）
- `qa-navigation.jpg`：導航工具情境圖與原文字卡（桌機）
- `qa-warmth.jpg`：分層禦寒情境圖與原文字卡（桌機）
- `qa-wildlife.jpg`：六格動物安全情境與原文字卡（桌機）
- `qa-tablet-water.jpg`：水處理段落（平板）
- `qa-mobile-wildlife.jpg`、`qa-mobile-stop.jpg`：動物與 STOP 段落（手機）
- `assets/images/social-preview.png`：Facebook／社群連結預覽圖

## 結論

通過。網站可進入正式發布流程。

## 公開部署驗證

- 公開網址：`https://prayer168.github.io/wild-survive/`
- GitHub Pages 建置狀態：`built`
- 公開首頁：HTTP 200，標題與主要教材內容正確。
- 公開 CSS：HTTP 200，MIME 為 `text/css`。
- 公開 Image 2.0 主圖：HTTP 200，MIME 為 `image/webp`。
- 公開社群預覽圖：HTTP 200，MIME 為 `image/png`。
- 公開雙語貼文檔：HTTP 200，MIME 為 `text/plain`。
- 公開版所有延遲載入圖片成功，桌機 1440×1000 與手機 390×844 無水平溢出。
- 公開版 Open Graph 圖片網址、1200×630 尺寸欄位與 `summary_large_image` Twitter Card 均正確。

最終結論：公開網站、社群預覽與雙語 Facebook 貼文均通過發布閘門。
