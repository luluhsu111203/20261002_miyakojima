/* =========================================================
   網站設定
   ---------------------------------------------------------
   SYNC_ENABLED：評分是否同步到 Google 試算表（Apps Script）。
     - false：評分只存在各自的手機，兩人看不到對方的評分。
     - true ：評分會送到下面的 Apps Script，並讀回對方的評分。
     請先把 apps-script/Code.gs（第 2 版）部署好，再改成 true。
     網頁會先確認 Apps Script 是第 2 版才送出資料，
     舊版的 Apps Script 不會收到任何寫入。
   ========================================================= */
const CONFIG = {
  SYNC_ENABLED: true,
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbx2FBbN9TG06jmLE2dgPtkHIDhYcI-qMqBvyN9F7TdKp9RRyS5aI_FNw9QY0HievklM/exec",
  SYNC_INTERVAL_MS: 60000
};
