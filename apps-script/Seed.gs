/**
 * 宮古島行程網站｜行程初始資料（第 4 版）
 * ------------------------------------------------------------
 * 在 Apps Script 專案裡新增一個指令碼檔案 Seed.gs，貼上這份內容。
 * 選擇函式 seedItinerary 並按「執行」一次，就會把下面的行程寫進「行程」「每日」工作表。
 * 只有「行程」工作表還沒有資料時才會寫入，不會蓋掉已經編輯過的內容。
 * 匯入之後行程請直接在試算表修改；這份檔案之後不會再被用到。
 * （由 itinerary.js 產生）
 */

// 每日：[日期, 標題]
var SEED_DAYS = [
  ["2026-10-02",""],
  ["2026-10-03",""],
  ["2026-10-04",""],
  ["2026-10-05","隨便吃吃到處走走的一天"],
  ["2026-10-06",""],
  ["2026-10-07",""]
];

// 行程：[id, 日期, 時間, 名稱, 類型, 緯度, 經度, 地圖連結, 地址, 營業時間, 電話, 預約資訊, 推薦文章, 備註]
var SEED_STOPS = [
  [1,"2026-10-02","09:40","下地島機場","",24.8290343,125.1495618,"https://www.google.com/maps/place/%E4%B8%8B%E5%9C%B0%E5%B3%B6%E6%A9%9F%E5%A0%B4/@24.8290391,125.1469869,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abf2774fbddf:0x4052ebc4675369ff!8m2!3d24.8290343!4d125.1495618!16s%2Fm%2F03m5839","Sawada-1727 Irabu, Miyakojima, Okinawa 906-0507 日本","","","","",""],
  [2,"2026-10-02","10:00","MIYAKOJIMA ECO + Car Rental（租車）","",24.8267045,125.1714631,"https://www.google.com/maps/place/MIYAKOJIMA+ECO+%2B+Car+Rental/@24.8267093,125.1688882,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abf48240783f:0x45ef0b215c3f509e!8m2!3d24.8267045!4d125.1714631!16s%2Fg%2F11v60l8_py","Kuninaka-101-1 Irabu, Miyakojima, Okinawa 906-0505 日本","08:00–19:00","+81 980795625","","","租車，會來機場接機。問老闆禮拜三 8點半還車再去機場來得及嗎？怎去？計程車？？島上注意事項、加油怎麼加、柴油汽油？輕油？盡量別弄髒，後面不用清得那麼辛苦"],
  [3,"2026-10-02","","Kuninaka Shoten（早餐咖啡廳）","",24.8285322,125.1632113,"https://maps.app.goo.gl/WHjz8k8crQcow6u48","Kuninaka-531-1 Irabu, Miyakojima, Okinawa 906-0505 日本","08:00–19:00","","","","要早點去，會沒有麵包。吃早餐的咖啡廳"],
  [4,"2026-10-02","","Blue Turtle","",24.812313,125.1826324,"https://www.google.com/maps/place/Blue+Turtle/@24.8123178,125.1800575,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5ab0d1ae541e1:0x32d7c96fe55c156c!8m2!3d24.812313!4d125.1826324!16s%2Fg%2F11ghn7lry5","Irabu-1352-16 Irabu, Miyakojima, Okinawa 906-0503 Japan","11:00–21:00（午餐 11:00–17:00／晚餐 17:00–20:45 L.O.）","","可電話預訂，目前尚未預訂","","黑咖哩🍛跟冰沙超好吃，也有專屬沙灘！比較多人，有一些主食可以吃，位置較多的，沙灘比較美，沙子比較細。①因天氣原因，可能無法坐在露台座位上。②午餐時間（11:00～17:00）不接受預約。③最後進店時間為20:45。"],
  [5,"2026-10-02","","Hotel Shionno Umi","住宿",24.8168558,125.2888276,"https://www.google.com/maps/place/Hotel+Shionno+Umi/@24.8168606,125.2862527,17z/data=!4m9!3m8!1s0x34f45384382b9999:0x1c44090084aa97ac!5m2!4m1!1i2!8m2!3d24.8168558!4d125.2888276!16s%2Fg%2F11jg66tj_j","Nikadori-269-1 Hirara, Okinawa 906-0008 日本","","","","","15:00 入住（之後每天都住同一間，只有第 1 天 check-in）"],
  [6,"2026-10-02","18:00","火神燒肉","",24.7896256,125.2797295,"https://www.google.com/maps/place/%E7%81%AB%E7%A5%9E%E7%87%92%E8%82%89/@24.7896304,125.2771546,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4546d5929dfd1:0x4bfd38a20f62c908!8m2!3d24.7896256!4d125.2797295!16s%2Fg%2F11b7h9gxs1","Matsubara-548-1 Hirara, Okinawa 906-0014 日本","17:00–23:00（L.O.22:00）","","[booking.ebica.jp 預約連結](https://booking.ebica.jp/websrv/search/e014172801/32412?affiid=glb)／預定名稱：inamura chizumi／預定時間：18:00","[Threads 引用](https://www.threads.com/@chiao_1108_/post/DaCmeYOj5x7)","還沒定位"],
  [7,"2026-10-02","","永旺城宮古南購物中心","",24.7877418,125.2806897,"https://www.google.com/maps/place/%E6%B0%B8%E6%97%BA%E5%9F%8E%E5%AE%AE%E5%8F%A4%E5%8D%97%E8%B3%BC%E7%89%A9%E4%B8%AD%E5%BF%83/@24.7877466,125.2781148,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4546d3260ae07:0xb0133e304f216bf3!8m2!3d24.7877418!4d125.2806897!16s%2Fg%2F121gpqmd","Matsubara-631 Hirara, Okinawa 906-0014 日本","每家店不同／DAISO：09:00–21:00","","","",""],
  [8,"2026-10-02","","唐吉訶德 宮古島店","",24.7925269,125.3015506,"https://www.google.com/maps/place/%E5%94%90%E5%90%89%E8%A8%B6%E5%BE%B7+%E5%AE%AE%E5%8F%A4%E5%B3%B6%E5%BA%97/@24.7925317,125.2989757,17z/data=!3m1!4b1!4m6!3m5!1s0x34f45400473d64e1:0xd58e06fa88f47a99!8m2!3d24.7925269!4d125.3015506!16s%2Fg%2F11c48mw5m9","Nishizato-1283 Hirara, Okinawa 906-0012 日本","08:00–翌03:00","","","","無（有專屬折價券）"],
  [9,"2026-10-03","","SUNDAYS Miyakojima","",24.8025916,125.2832623,"https://www.google.com/maps/place/SUNDAYS+Miyakojima/@24.8025964,125.2806874,17z/data=!3m1!4b1!4m6!3m5!1s0x34f453a5f14ea917:0x7b91ca7b5560bc07!8m2!3d24.8025916!4d125.2832623!16s%2Fg%2F11h21zg4_j","〒906-0012 Okinawa, Miyakojima, Hirara, Nishizato-561 Hotel385 1F 日本","11:00–17:00","+81 980-79-5085","","","宮古牛漢堡"],
  [10,"2026-10-03","14:30–16:30","UNI BEACH（完潛，集合地點）","",24.8013675,125.2636718,"https://www.google.com/maps/place/%E5%AE%AE%E5%8F%A4%E5%B3%B6%E9%87%A3%E3%82%8A%E8%88%B9PANANA/@24.8013723,125.2610969,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4557c1c971e39:0x4f02a9d18f8a0f6b!8m2!3d24.8013675!4d125.2636718!16s%2Fg%2F11t7tgn43k","宮古島釣り船PANANA（集合地點：圖里巴碼頭）","","","[kkday 預約連結](https://www.kkday.com/zh-tw/order/show/26KK219244847)／kkday預定／預定時間：14:30","",""],
  [11,"2026-10-03","","Twuriba Marina","",24.8024303,125.2632222,"https://www.google.com/maps/place/Twuriba+Marina/@24.8024351,125.2606473,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4547ee1d150f7:0xe912bca8f98783a5!8m2!3d24.8024303!4d125.2632222!16s%2Fg%2F11c1ndc35g","Miyakojima, Okinawa 906-0000 日本","","","","","海岸"],
  [12,"2026-10-03","20:00","預計銀河拍照","","","","","","","","Line預定／預定時間：20:00","","地點待定，依當天天氣決定拍攝地點"],
  [13,"2026-10-04","","買東西吃","","","","","","","","","",""],
  [14,"2026-10-04","10:30–11:00","透明sup","","","","","","","","","[cheerful-miyakojima.com](https://cheerful-miyakojima.com/)","看天氣換 sup 地點，前一天會寄信通知最終地點，預計以下其一：【新城海岸 Aragusuku Beach】、【Imgyaa Marine Garden】、【與那霸前濱海灘北側 Yonaha Beach】。（先保留 13000 現金）。出發前先吃點東西"],
  [15,"2026-10-04","","午餐待定","","","","","","","","","","原本預計吃宮古麵，但那家店週日應該是公休"],
  [16,"2026-10-04","20:30","宮古牛燒肉 玉城","",24.8042797,125.2790888,"https://maps.app.goo.gl/cLdavDG66CLrPydx5","〒906-0013 Okinawa, Miyakojima, Hirara, Shimozato-3 セイルイン宮古島 1F 日本","17:00–23:00（L.O.22:00）","+81 980-79-5888","[tabelog 連結](https://tabelog.com/tw/okinawa/A4705/A470503/47026386/)／預定名稱：inamura chizumi／預定時間：20:30／用餐時間90分","","宮古牛推薦，很多台灣人，要訂位。最後入店時間為21:30"],
  [17,"2026-10-05","","Nakayukui Shoten（なかゆくい商店）","",24.8258947,125.1700315,"https://www.google.com/maps/place/Nakayukui+Shoten/@24.8258995,125.1674566,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abcb0d49ccd3:0x6ba4be9a93fde287!8m2!3d24.8258947!4d125.1700315!16s%2Fg%2F11j8p7zvvp","〒906-0505 Okinawa, Miyakojima, Irabu, Kuninaka-5 7-3 日本","09:30–12:00／13:30–16:00","+81 90-9476-3215","","","好吃的甜甜圈🍩，一定要加冰淇淋"],
  [18,"2026-10-05","","Gelato Cafe Ninufa","",24.9299217,125.2334483,"https://www.google.com/maps/place/Gelato+Cafe+Ninufa/@24.9299265,125.2308734,17z/data=!3m1!4b1!4m6!3m5!1s0x34f44d173aba1493:0x51cb5fcedb4bcbca!8m2!3d24.9299217!4d125.2334483!16s%2Fg%2F11s0rd1nck","Maezato-976-1 Hirara, Miyakojima, Okinawa 906-0422 日本","10:00–17:00","+81980795696","","[Threads 引用](https://www.threads.com/@chiao_1108_/post/DZ39mk9j1AF)","池間島的 gelato，下去的海灘有很多寄居蟹"],
  [19,"2026-10-05","19:00","HULAR（居酒屋）","",24.804785,125.2780718,"https://www.google.com/maps/place/HULAR/@24.8047898,125.2754969,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4533ebfa66a4b:0x71aa8034a7856d73!8m2!3d24.804785!4d125.2780718!16s%2Fg%2F11t9bx9f_6","〒906-0013 Okinawa, Miyakojima, Hirara, Shimozato-3 3 日本","17:00–翌01:00（L.O. 翌00:30）","+81 980-79-0477","[tabelog 連結](https://tabelog.com/okinawa/A4705/A470503/47029528/)／預定名稱：inamura chizumi／預定時間：19:00／用餐時間2小時","","要預約。營業 17:00-23:00，禮拜二休息"],
  [20,"2026-10-06","","鶏白湯宮古そば屋&宿 ポークランチョンミート","",24.8041413,125.2730864,"https://www.google.com/maps/place/%E3%83%9D%E3%83%BC%E3%82%AF%E3%83%A9%E3%83%B3%E3%83%81%E3%83%A7%E3%83%B3%E3%83%9F%E3%83%BC%E3%83%88/@24.8041461,125.2705115,17z/data=!4m9!3m8!1s0x34f45389a7d3019f:0x3efc8ffd1224574!5m2!4m1!1i2!8m2!3d24.8041413!4d125.2730864!16s%2Fg%2F11ckr_qxbz","Shimozato-338-50 Hirara, Miyakojima, Okinawa 906-0013 日本","不定休 11:30–14:30（L.O.14:00）","+81 90-7945-0844","","","無法預約，現金支付。拉麵評價很好。臨時休息會前一天在 IG 公告：[instagram.com/plm385](https://www.instagram.com/plm385/)"],
  [21,"2026-10-06","15:30–17:30","浮潛 海龜（體驗地點：Shigira Beach Parking Lot）","",24.7211266,125.3422371,"https://www.google.com/maps/place/Shigira+Beach+Parking+Lot/@24.7211315,125.3396622,17z/data=!3m1!4b1!4m6!3m5!1s0x34f45635fbf81901:0xd9f12228f0bf8f50!8m2!3d24.7211266!4d125.3422371!16s%2Fg%2F11bwqn39l1","Ueno, Miyakojima, Okinawa 906-0000 日本","","","[kkday 連結](https://www.kkday.com/zh-tw/product/36210-miyakojima-snorkeling-with-sea-turtles-okinawa-japan)／kkday預定／預定時間：15:30","","前一天看 KKDAY 訊息"],
  [22,"2026-10-06","19:30","木炭烤肉 琉宮園","",24.7207313,125.3342712,"https://www.google.com/maps/place/%E6%9C%A8%E7%82%AD%E7%83%A4%E8%82%89+%E7%90%89%E5%AE%AE%E5%9C%92/@24.7207362,125.3316963,17z/data=!3m1!4b1!4m6!3m5!1s0x34f45639b61a4077:0x49a416b450432064!8m2!3d24.7207313!4d125.3342712!16s%2Fg%2F1tkb2w91","沖繩縣 宮古島市 上野 日本","17:00–22:00（L.O.21:30）","","[tablecheck 預約連結](https://www.tablecheck.com/shops/shigira-ryuguen/reserve)／[地圖分享連結](https://share.google/NJBvgffvDZdv5V3ME)／預定名稱：inamura chizumi／預定時間：19:30／已預訂主廚無菜單料理套餐$12,000／先訂一個套餐其他到現場點","","要訂位"],
  [23,"2026-10-07","","apollostation みなみ給油所／（有）豊見山石油","",24.8288916,125.1680398,"https://www.google.com/maps/place/apollostation+%E3%81%BF%E3%81%AA%E3%81%BF%E7%B5%A6%E6%B2%B9%E6%89%80%EF%BC%8F%EF%BC%88%E6%9C%89%EF%BC%89%E8%B1%8A%E8%A6%8B%E5%B1%B1%E7%9F%B3%E6%B2%B9/@24.8288964,125.1654649,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5ab80898aaaf9:0xa5f5b52f41681cbf!8m2!3d24.8288916!4d125.1680398!16s%2Fg%2F1td7qyvc","Nagahama-1413-5 Irabu, Miyakojima, Okinawa 906-0506 日本","08:00–18:00","","","","加油站。旅館開到這裡要半小時"],
  [24,"2026-10-07","09:00","MIYAKOJIMA ECO + Car Rental（還車）","",24.8267045,125.1714631,"https://www.google.com/maps/place/MIYAKOJIMA+ECO+%2B+Car+Rental/@24.8267093,125.1688882,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abf48240783f:0x45ef0b215c3f509e!8m2!3d24.8267045!4d125.1714631!16s%2Fg%2F11v60l8_py","Kuninaka-101-1 Irabu, Miyakojima, Okinawa 906-0505 日本","08:00–19:00","+81 980795625","","","前一天先清潔。還車前先去加油（前一天or當天）。8點45還車 - 凹老闆接送。9點40關櫃"],
  [25,"2026-10-07","10:40","下地島機場（出境）","",24.8290343,125.1495618,"https://www.google.com/maps/place/%E4%B8%8B%E5%9C%B0%E5%B3%B6%E6%A9%9F%E5%A0%B4/@24.8290391,125.1469869,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abf2774fbddf:0x4052ebc4675369ff!8m2!3d24.8290343!4d125.1495618!16s%2Fm%2F03m5839","Sawada-1727 Irabu, Miyakojima, Okinawa 906-0507 日本","","","","","10:40-11:00"]
];

function seedItinerary() {
  setup();
  var sh = getSheet(TRIP_SHEET, TRIP_HEADERS);
  var dsh = getSheet(TRIP_DAYS_SHEET, TRIP_DAYS_HEADERS);
  if (hasData(sh) || hasData(dsh)) {
    throw new Error("「" + TRIP_SHEET + "」或「" + TRIP_DAYS_SHEET + "」已經有資料，為了不蓋掉你的修改，沒有匯入。要重新匯入請先清空這兩個工作表（保留第一列標題）。");
  }
  dsh.getRange(2, 1, SEED_DAYS.length, 2).setValues(SEED_DAYS.map(function (r) { return r.map(seedCell); }));
  var rows = SEED_STOPS.map(function (r) { return r.map(seedCell).concat([false]); }); // 最後一欄：隱藏
  sh.getRange(2, 1, rows.length, TRIP_HEADERS.length).setValues(rows);
  clearTripCache();
  Logger.log("完成：匯入 " + SEED_DAYS.length + " 天、" + SEED_STOPS.length + " 個行程點");
}

// 第一欄（行程的 id、每日的日期）有沒有填東西。
// 不用 getLastRow()：「隱藏」欄的勾選框會被算成有內容，getLastRow() 會一直等於整張表的最後一列。
function hasData(sheet) {
  var n = sheet.getMaxRows() - 1;
  if (n < 1) return false;
  return sheet.getRange(2, 1, n, 1).getValues().some(function (r) { return String(r[0]).trim() !== ""; });
}

// 文字開頭是 = + - @ 時前面加 '，避免被當成公式（例如電話 +81…）；畫面上不會顯示這個符號
function seedCell(v) {
  return (typeof v === "string" && /^[=+\-@]/.test(v)) ? "'" + v : v;
}
