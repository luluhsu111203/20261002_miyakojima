/**
 * 宮古島行程網站｜行程＋評分後端（Google Apps Script）第 4 版
 * ------------------------------------------------------------
 * 用途：
 *   A. 行程資料（第 4 版新增）：在試算表的「行程」「每日」兩個工作表編輯，網頁會讀取顯示。
 *   B. 保存兩種評分，讓 Jeffrey 與 Chizumi 的手機可以互相看到。
 *     1. 今日記憶球：每天、每人一列（星數 + 今天最喜歡的部分）
 *     2. 行程點評分：每個行程點、每人一列（只有星數）
 *
 * 部署方式（整份取代舊的 Code.gs）：
 *   1. 貼上這份程式碼並儲存；另外新增一個指令碼檔案 Seed.gs，貼上 apps-script/Seed.gs。
 *   2. 在上方選單選擇函式 setup 並按「執行」：建立所有工作表、設定格式，
 *      並安裝「結構變更」觸發器（拖曳整列調整順序時也會馬上更新）。第一次會要求授權。
 *   3. 選擇函式 seedItinerary 並按「執行」：把目前網站上的行程匯入「行程」「每日」。
 *      （只在「行程」工作表還是空的時候會匯入，不會蓋掉已經編輯過的內容。）
 *   4. 「部署」→「管理部署作業」→ 編輯（鉛筆）→ 版本選「新版本」→ 部署。
 *      網址不會改變，網頁不需要改網址。
 *   5. 用瀏覽器打開「網址?action=trip」確認看得到行程 JSON，warnings 是空的。
 *
 * 行程工作表怎麼改：
 *   - 「每日」：一列一天（日期、標題），決定有哪幾天、順序和每天的標題。
 *   - 「行程」：一列一個行程點。同一天的行程點依「由上往下的列順序」顯示，拖曳整列就能調順序。
 *   - id：行程點固定代號，評分靠它對應。換日期、調順序都「不要改 id」；
 *         新增行程點請用沒用過的新號碼；不要的行程點勾「隱藏」，不要刪整列（評分會留著）。
 *   - 沒有的欄位留空白，網頁會顯示「-」。緯度／經度留空＝地點未定（不上地圖、沒有導航按鈕）。
 *   - 文字欄位可以用 [文字](網址) 寫連結。類型填 hotel 或「住宿」會顯示住宿標籤。
 *   - 有問題的列（id 重複、日期不在「每日」裡…）會被略過，原因列在 ?action=trip 的 warnings。
 *   - 改完約幾秒內生效（改儲存格或拖曳列都會清掉快取），最慢 5 分鐘。
 *
 * 寫入（POST，body 用 text/plain 送出 JSON，網頁可以直接讀到回應）：
 *   {"items":[
 *     {"type":"day","date":"2026-10-02","person":"Jeffrey","stars":4,"fav":"...","ts":1790000000000,"rid":"r...","device":"..."},
 *     {"type":"stop","id":6,"name":"火神燒肉","date":"2026-10-02","person":"Chizumi","stars":5,"ts":...,"rid":"r..."}
 *   ]}
 *   - 同一個鍵（日期+評分者、行程點 id+評分者）只留一列，重送就覆蓋。
 *   - rid（版本碼）：手機每次修改評分就產生一組新的隨機碼，跟著寫進試算表。
 *     網頁用「試算表裡的 rid 是否等於待送的 rid」確認有沒有送達。
 *   - 只有 ts（手機上修改的時間）比試算表裡新才會覆蓋，所以補送舊資料不會蓋掉新資料。
 *   - stars = 0 代表「清除評分」。
 *   回應：{"ok":true,"version":3,"written":1,"done":["r...", ...]}
 *   - done：已經處理完、不需要再送的 rid（寫入成功、試算表已經是同一版、
 *     試算表有更新的版本，或資料格式錯誤再送也沒用）。
 *
 * 讀取（GET）：?action=all  → 回傳所有評分（JSON，含 rid）
 *            ?action=trip → 回傳行程 {ok, version, trip:{days:[{date,title,stops:[…]}]}, warnings}
 *            加上 &callback=fn → 同上，但包成 fn(...)（JSONP 備案）
 *            ?action=trip&nocache=1 → 不用快取，直接讀試算表（除錯用）
 */

var API_VERSION = 4;
var PEOPLE = ["Jeffrey", "Chizumi"];

var DAY_SHEET = "今日記憶球";
var DAY_HEADERS = ["日期", "評分者", "星數", "今天最喜歡的部分", "更新時間", "裝置", "版本碼"];

var STOP_SHEET = "行程點評分";
var STOP_HEADERS = ["行程點 id", "地點名稱", "日期", "評分者", "星數", "更新時間", "裝置", "版本碼"];

// 行程（第 4 版）：一列一個行程點；key 是網頁用的欄位名稱
var TRIP_SHEET = "行程";
var TRIP_COLS = [
  { h: "id",       key: "id" },
  { h: "日期",     key: "date" },
  { h: "時間",     key: "time" },
  { h: "名稱",     key: "name" },
  { h: "類型",     key: "type" },
  { h: "緯度",     key: "lat" },
  { h: "經度",     key: "lng" },
  { h: "地圖連結", key: "mapUrl" },
  { h: "地址",     key: "address" },
  { h: "營業時間", key: "hours" },
  { h: "電話",     key: "phone" },
  { h: "預約資訊", key: "reservation" },
  { h: "推薦文章", key: "article" },
  { h: "備註",     key: "note" },
  { h: "隱藏",     key: "hidden" }
];
var TRIP_HEADERS = TRIP_COLS.map(function (c) { return c.h; });
var TRIP_DAYS_SHEET = "每日";
var TRIP_DAYS_HEADERS = ["日期", "標題"];
var TRIP_CACHE_KEY = "trip_v4";
var TRIP_CACHE_SEC = 300;

// 要設成純文字的欄位：日期避免被轉成日期格式、版本碼避免被轉成數字、
// 時間避免被轉成時間、電話的「+81…」避免被當成公式，其他文字欄位避免被自動轉換
var TEXT_HEADERS = ["日期", "版本碼", "時間", "名稱", "類型", "地圖連結", "地址", "營業時間", "電話", "預約資訊", "推薦文章", "備註", "標題"];

/* ---------------- 寫入 ---------------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    lock.waitLock(20000);
    locked = true;
    var body = JSON.parse(e.postData.contents);
    var items = (body && Array.isArray(body.items)) ? body.items : [body];
    var written = 0, done = [];
    for (var i = 0; i < items.length && i < 200; i++) {
      try {
        if (writeItem(items[i]) === "written") written++;
        if (items[i] && items[i].rid) done.push(String(items[i].rid));
      } catch (itemErr) {
        Logger.log(itemErr); // 這筆沒有寫成功：不放進 done，網頁會再送
      }
    }
    return out({ ok: true, version: API_VERSION, written: written, done: done });
  } catch (err) {
    Logger.log(err);
    return out({ ok: false, version: API_VERSION });
  } finally {
    if (locked) { try { lock.releaseLock(); } catch (x) {} }
  }
}

// 回傳 "written"（寫入）、"same"（已經是同一版）、"stale"（試算表比較新）、"invalid"（格式錯誤）
function writeItem(it) {
  if (!it || PEOPLE.indexOf(it.person) < 0) return "invalid";
  var stars = Number(it.stars);
  if (!(stars >= 0 && stars <= 5 && Math.floor(stars) === stars)) return "invalid";
  var ts = Number(it.ts);
  if (!(ts > 0)) ts = Date.now();
  var device = clean(it.device, 120);
  var rid = clean(it.rid, 64);

  if (it.type === "day") {
    if (!isDate(it.date)) return "invalid";
    var sh = getSheet(DAY_SHEET, DAY_HEADERS);
    return upsert(sh, [0, 1], [it.date, it.person], 4, 6, ts, rid,
      [it.date, it.person, stars, clean(it.fav, 1000), new Date(ts), device, rid]);
  }

  if (it.type === "stop") {
    var id = Number(it.id);
    if (!(id > 0 && Math.floor(id) === id)) return "invalid";
    var date = isDate(it.date) ? it.date : "";
    var sh2 = getSheet(STOP_SHEET, STOP_HEADERS);
    return upsert(sh2, [0, 3], [id, it.person], 5, 7, ts, rid,
      [id, clean(it.name, 120), date, it.person, stars, new Date(ts), device, rid]);
  }
  return "invalid";
}

// 依鍵找到既有列就覆蓋（只在比較新時），找不到就新增
function upsert(sheet, keyCols, keyVals, tsCol, ridCol, ts, rid, values) {
  var last = sheet.getLastRow();
  if (last > 1) {
    var rows = sheet.getRange(2, 1, last - 1, values.length).getValues();
    for (var i = 0; i < rows.length; i++) {
      var match = true;
      for (var k = 0; k < keyCols.length; k++) {
        if (norm(rows[i][keyCols[k]]) !== norm(keyVals[k])) { match = false; break; }
      }
      if (match) {
        if (rid && String(rows[i][ridCol]) === rid) return "same"; // 重送同一版
        var oldTs = rows[i][tsCol] instanceof Date ? rows[i][tsCol].getTime() : 0;
        if (ts < oldTs) return "stale"; // 試算表裡的比較新，不覆蓋
        sheet.getRange(i + 2, 1, 1, values.length).setValues([values]);
        return "written";
      }
    }
  }
  sheet.appendRow(values);
  return "written";
}

/* ---------------- 讀取 ---------------- */
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === "all") {
    return out({ ok: true, version: API_VERSION, days: readDays(), stops: readStops() }, p.callback);
  }
  if (p.action === "trip") {
    var t = getTrip(p.nocache === "1");
    return out({ ok: true, version: API_VERSION, trip: t.trip, warnings: t.warnings }, p.callback);
  }
  return out({ ok: true, version: API_VERSION, message: "OK：Apps Script 第 4 版已部署" }, p.callback);
}

/* ---------------- 行程 ---------------- */
// 先看快取；試算表被修改時 onEdit / onTripChange 會清掉快取
function getTrip(noCache) {
  var cache = CacheService.getScriptCache();
  if (!noCache) {
    var hit = cache.get(TRIP_CACHE_KEY);
    if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  }
  var t = readTrip();
  try { cache.put(TRIP_CACHE_KEY, JSON.stringify(t), TRIP_CACHE_SEC); } catch (e) { Logger.log(e); }
  return t;
}

function clearTripCache() {
  try { CacheService.getScriptCache().remove(TRIP_CACHE_KEY); } catch (e) {}
}

// 簡單觸發器：改「行程」「每日」的儲存格時清快取（不需要安裝）
function onEdit(e) {
  var name = e && e.range ? e.range.getSheet().getName() : "";
  if (!name || name === TRIP_SHEET || name === TRIP_DAYS_SHEET) clearTripCache();
}

// 可安裝觸發器（setup 會安裝）：拖曳整列、插入／刪除列等結構變更不會觸發 onEdit，由這個清快取
function onTripChange(e) {
  clearTripCache();
}

function readTrip() {
  var warnings = [];
  var dayList = [], dayMap = {};

  // 每日：決定有哪幾天、順序與標題
  var dsh = getSheet(TRIP_DAYS_SHEET, TRIP_DAYS_HEADERS), dLast = dsh.getLastRow();
  if (dLast > 1) {
    var dVals = dsh.getRange(2, 1, dLast - 1, 2).getValues();
    var dDisp = dsh.getRange(2, 1, dLast - 1, 2).getDisplayValues();
    for (var i = 0; i < dVals.length; i++) {
      var rowNo = i + 2, rawDate = String(dDisp[i][0]).trim();
      if (!rawDate && !String(dDisp[i][1]).trim()) continue; // 空白列
      var date = toDate(dVals[i][0], rawDate);
      if (!date) { warnings.push("每日 第 " + rowNo + " 列：日期「" + rawDate + "」看不懂，請用 2026-10-02 格式"); continue; }
      if (dayMap[date]) { warnings.push("每日 第 " + rowNo + " 列：日期 " + date + " 重複，已略過"); continue; }
      var day = { date: date, title: str(dDisp[i][1]), stops: [] };
      dayMap[date] = day;
      dayList.push(day);
    }
  }

  // 行程：依列順序放進各天
  var sh = getSheet(TRIP_SHEET, TRIP_HEADERS), last = sh.getLastRow(), n = TRIP_HEADERS.length;
  var col = {};
  TRIP_COLS.forEach(function (c, k) { col[c.key] = k; });
  var seen = {};
  if (last > 1) {
    var vals = sh.getRange(2, 1, last - 1, n).getValues();
    var disp = sh.getRange(2, 1, last - 1, n).getDisplayValues();
    for (var r = 0; r < vals.length; r++) {
      var v = vals[r], d = disp[r], no = r + 2;
      var name = String(d[col.name]).trim(), idText = String(d[col.id]).trim();
      if (!idText && !name) continue; // 空白列
      var id = Number(v[col.id]);
      if (!(id > 0 && Math.floor(id) === id)) { warnings.push("行程 第 " + no + " 列（" + name + "）：id「" + idText + "」要是正整數，已略過"); continue; }
      if (seen[id]) { warnings.push("行程 第 " + no + " 列（" + name + "）：id " + id + " 跟第 " + seen[id] + " 列重複，已略過"); continue; }
      seen[id] = no;
      if (isHidden(v[col.hidden])) continue;
      if (!name) { warnings.push("行程 第 " + no + " 列（id " + id + "）：沒有名稱，已略過"); continue; }
      var rawD = String(d[col.date]).trim(), date2 = toDate(v[col.date], rawD);
      if (!date2 || !dayMap[date2]) {
        warnings.push("行程 第 " + no + " 列（" + name + "）：日期「" + rawD + "」" + (date2 ? "不在「每日」工作表裡" : "看不懂") + "，已略過");
        continue;
      }
      var stop = { id: id, time: str(d[col.time]), name: name };
      var type = String(d[col.type]).trim().toLowerCase();
      if (type === "hotel" || type === "住宿") stop.type = "hotel";
      var lat = num(v[col.lat]), lng = num(v[col.lng]);
      var hasLat = String(d[col.lat]).trim() !== "", hasLng = String(d[col.lng]).trim() !== "";
      if (lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) { stop.lat = lat; stop.lng = lng; }
      else {
        stop.lat = null; stop.lng = null;
        if (hasLat || hasLng) warnings.push("行程 第 " + no + " 列（" + name + "）：緯度／經度要兩個都填數字，先當作地點未定");
      }
      var url = str(d[col.mapUrl]);
      if (url && !/^https?:\/\//i.test(url)) { warnings.push("行程 第 " + no + " 列（" + name + "）：地圖連結要用 http(s):// 開頭，已略過連結"); url = null; }
      stop.mapUrl = url;
      ["address", "hours", "phone", "reservation", "article", "note"].forEach(function (k) { stop[k] = str(d[col[k]]); });
      dayMap[date2].stops.push(stop);
    }
  }
  return { trip: { days: dayList }, warnings: warnings };
}

// 試算表的日期：可能是日期物件或文字（2026-10-02、2026/10/2）→ "yyyy-MM-dd"，看不懂回傳 ""
function toDate(value, text) {
  if (value instanceof Date) return norm(value);
  var m = String(text).trim().match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/);
  if (!m) return "";
  return m[1] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[3]).slice(-2);
}

function isHidden(v) {
  if (v === true) return true;
  return /^(true|v|x|y|yes|是|隱藏|✓|✔)$/i.test(String(v).trim());
}

function str(v) {
  var s = String(v == null ? "" : v).trim();
  return s ? s : null;
}

function num(v) {
  if (v === "" || v === null || v === true || v === false) return null;
  var x = Number(v);
  return isFinite(x) ? x : null;
}

function readDays() {
  var sh = getSheet(DAY_SHEET, DAY_HEADERS), last = sh.getLastRow(), res = {};
  if (last < 2) return res;
  sh.getRange(2, 1, last - 1, DAY_HEADERS.length).getValues().forEach(function (r) {
    var date = norm(r[0]), person = String(r[1]);
    if (!isDate(date) || PEOPLE.indexOf(person) < 0) return;
    res[date] = res[date] || {};
    res[date][person] = { stars: Number(r[2]) || 0, fav: String(r[3] || ""), ts: r[4] instanceof Date ? r[4].getTime() : 0, rid: String(r[6] || "") };
  });
  return res;
}

function readStops() {
  var sh = getSheet(STOP_SHEET, STOP_HEADERS), last = sh.getLastRow(), res = {};
  if (last < 2) return res;
  sh.getRange(2, 1, last - 1, STOP_HEADERS.length).getValues().forEach(function (r) {
    var id = Number(r[0]), person = String(r[3]);
    if (!(id > 0) || PEOPLE.indexOf(person) < 0) return;
    res[id] = res[id] || {};
    res[id][person] = { stars: Number(r[4]) || 0, ts: r[5] instanceof Date ? r[5].getTime() : 0, rid: String(r[7] || "") };
  });
  return res;
}

/* ---------------- 工具 ---------------- */
function getSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    setTextColumns(sh, headers, 0);
  } else {
    // 舊版建立的工作表：補上後來新增的欄位（例如第 3 版的「版本碼」）
    var lastCol = sh.getLastColumn();
    if (lastCol < headers.length) {
      sh.getRange(1, lastCol + 1, 1, headers.length - lastCol).setValues([headers.slice(lastCol)]);
      setTextColumns(sh, headers, lastCol);
    }
  }
  return sh;
}

// 把 from 之後的純文字欄位設成 "@"，避免試算表自動轉換格式
function setTextColumns(sh, headers, from) {
  for (var c = from; c < headers.length; c++) {
    if (TEXT_HEADERS.indexOf(headers[c]) >= 0) sh.getRange(1, c + 1, sh.getMaxRows(), 1).setNumberFormat("@");
  }
}

function norm(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  return String(v);
}

function isDate(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s); }

function clean(value, max) {
  var s = String(value == null ? "" : value).slice(0, max);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // 防止試算表公式注入
  return s;
}

function out(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback && /^[A-Za-z_$][\w$]{0,40}$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

// 手動執行一次：建立所有工作表、設定格式、安裝結構變更觸發器
function setup() {
  getSheet(DAY_SHEET, DAY_HEADERS);
  getSheet(STOP_SHEET, STOP_HEADERS);
  getSheet(TRIP_DAYS_SHEET, TRIP_DAYS_HEADERS);
  var tsh = getSheet(TRIP_SHEET, TRIP_HEADERS);
  // 「隱藏」欄做成勾選框
  var hc = TRIP_HEADERS.indexOf("隱藏") + 1;
  tsh.getRange(2, hc, tsh.getMaxRows() - 1, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var has = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === "onTripChange"; });
  if (!has) ScriptApp.newTrigger("onTripChange").forSpreadsheet(ss).onChange().create();
  clearTripCache();
  Logger.log("完成：已建立評分與行程工作表" + (has ? "" : "，並安裝結構變更觸發器"));
}
