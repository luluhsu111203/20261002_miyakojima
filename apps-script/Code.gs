/**
 * 宮古島行程網站｜評分後端（Google Apps Script）第 3 版
 * ------------------------------------------------------------
 * 用途：保存兩種評分，讓 Jeffrey 與 Chizumi 的手機可以互相看到。
 *   1. 今日記憶球：每天、每人一列（星數 + 今天最喜歡的部分）
 *   2. 行程點評分：每個行程點、每人一列（只有星數）
 *
 * 部署方式（整份取代舊的 Code.gs）：
 *   1. 貼上這份程式碼並儲存。
 *   2. （建議）在上方選單選擇函式 setup 並按「執行」，會建立兩個工作表、
 *      補上第 3 版新增的「版本碼」欄位並設定格式。
 *   3. 「部署」→「管理部署作業」→ 編輯（鉛筆）→ 版本選「新版本」→ 部署。
 *      網址不會改變，網頁不需要改網址。
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
 *            ?action=all&callback=fn → 同上，但包成 fn(...)（JSONP 備案）
 */

var API_VERSION = 3;
var PEOPLE = ["Jeffrey", "Chizumi"];

var DAY_SHEET = "今日記憶球";
var DAY_HEADERS = ["日期", "評分者", "星數", "今天最喜歡的部分", "更新時間", "裝置", "版本碼"];

var STOP_SHEET = "行程點評分";
var STOP_HEADERS = ["行程點 id", "地點名稱", "日期", "評分者", "星數", "更新時間", "裝置", "版本碼"];

// 要設成純文字的欄位：日期避免被轉成日期格式、版本碼避免被轉成數字
var TEXT_HEADERS = ["日期", "版本碼"];

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
  return out({ ok: true, version: API_VERSION, message: "OK：Apps Script 第 3 版已部署" }, p.callback);
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

// 手動執行一次：建立兩個工作表
function setup() {
  getSheet(DAY_SHEET, DAY_HEADERS);
  getSheet(STOP_SHEET, STOP_HEADERS);
  Logger.log("完成：已建立「" + DAY_SHEET + "」與「" + STOP_SHEET + "」工作表");
}
