# 品質檢核報告

檢核日期：2026-07-28

## 檢查環境

- Python 靜態伺服器：`http://127.0.0.1:4174/`
- Chromium 桌機視窗：1440 × 1000
- Chromium 平板視窗：768 × 1024
- Chromium 手機視窗：390 × 844

## 檢查結果

- [x] HTML 可載入且有完整語意內容，共 13 個主要區塊。
- [x] 7 張教材圖片與 1 張社群預覽圖皆能載入；教材圖片具有替代文字且只使用專案相對路徑。
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
- `assets/images/social-preview.png`：Facebook／社群連結預覽圖

## 結論

通過。網站可進入正式發布流程。
