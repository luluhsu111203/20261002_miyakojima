/* =========================================================
   宮古島 6 天 5 夜行程資料（2026/10/02–10/07）
   來源：「宮古島行程資料｜逐日整理」文件
   ---------------------------------------------------------
   修改行程只需要改這個檔案，網頁會自動更新。
   - id：行程點固定代號（primary id），評分用它當查詢鍵。
         調整順序或換日期時「不要改 id」；新增行程點請用新的號碼（26、27…）。
   - time / lat / lng / mapUrl / address / hours / phone /
     reservation / article / note：沒有就填 null，頁面會顯示「-」。
   - lat / lng 為 null 代表地點未定：不上地圖、不顯示導航按鈕。
   - 文字欄位可以用 [文字](網址) 寫連結。
   ========================================================= */

const TRIP = {
  title: "宮古島 6 天 5 夜",
  days: [
    /* ---------------- 第 1 天 ---------------- */
    {
      date: "2026-10-02",
      title: null,
      stops: [
        {
          id: 1, time: "09:40", name: "下地島機場",
          lat: 24.8290343, lng: 125.1495618,
          mapUrl: "https://www.google.com/maps/place/%E4%B8%8B%E5%9C%B0%E5%B3%B6%E6%A9%9F%E5%A0%B4/@24.8290391,125.1469869,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abf2774fbddf:0x4052ebc4675369ff!8m2!3d24.8290343!4d125.1495618!16s%2Fm%2F03m5839",
          address: "Sawada-1727 Irabu, Miyakojima, Okinawa 906-0507 日本",
          hours: null, phone: null, reservation: null, article: null, note: null
        },
        {
          id: 2, time: "10:00", name: "MIYAKOJIMA ECO + Car Rental（租車）",
          lat: 24.8267045, lng: 125.1714631,
          mapUrl: "https://www.google.com/maps/place/MIYAKOJIMA+ECO+%2B+Car+Rental/@24.8267093,125.1688882,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abf48240783f:0x45ef0b215c3f509e!8m2!3d24.8267045!4d125.1714631!16s%2Fg%2F11v60l8_py",
          address: "Kuninaka-101-1 Irabu, Miyakojima, Okinawa 906-0505 日本",
          hours: "08:00–19:00", phone: "+81 980795625", reservation: null, article: null,
          note: "租車，會來機場接機。問老闆禮拜三 8點半還車再去機場來得及嗎？怎去？計程車？？島上注意事項、加油怎麼加、柴油汽油？輕油？盡量別弄髒，後面不用清得那麼辛苦"
        },
        {
          id: 3, time: null, name: "Kuninaka Shoten（早餐咖啡廳）",
          lat: 24.8285322, lng: 125.1632113,
          mapUrl: "https://maps.app.goo.gl/WHjz8k8crQcow6u48",
          address: "Kuninaka-531-1 Irabu, Miyakojima, Okinawa 906-0505 日本",
          hours: "08:00–19:00", phone: null, reservation: null, article: null,
          note: "要早點去，會沒有麵包。吃早餐的咖啡廳"
        },
        {
          id: 4, time: null, name: "Blue Turtle",
          lat: 24.812313, lng: 125.1826324,
          mapUrl: "https://www.google.com/maps/place/Blue+Turtle/@24.8123178,125.1800575,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5ab0d1ae541e1:0x32d7c96fe55c156c!8m2!3d24.812313!4d125.1826324!16s%2Fg%2F11ghn7lry5",
          address: "Irabu-1352-16 Irabu, Miyakojima, Okinawa 906-0503 Japan",
          hours: "11:00–21:00（午餐 11:00–17:00／晚餐 17:00–20:45 L.O.）", phone: null,
          reservation: "可電話預訂，目前尚未預訂", article: null,
          note: "黑咖哩🍛跟冰沙超好吃，也有專屬沙灘！比較多人，有一些主食可以吃，位置較多的，沙灘比較美，沙子比較細。①因天氣原因，可能無法坐在露台座位上。②午餐時間（11:00～17:00）不接受預約。③最後進店時間為20:45。"
        },
        {
          id: 5, type: "hotel", time: null, name: "Hotel Shionno Umi",
          lat: 24.8168558, lng: 125.2888276,
          mapUrl: "https://www.google.com/maps/place/Hotel+Shionno+Umi/@24.8168606,125.2862527,17z/data=!4m9!3m8!1s0x34f45384382b9999:0x1c44090084aa97ac!5m2!4m1!1i2!8m2!3d24.8168558!4d125.2888276!16s%2Fg%2F11jg66tj_j",
          address: "Nikadori-269-1 Hirara, Okinawa 906-0008 日本",
          hours: null, phone: null, reservation: null, article: null,
          note: "15:00 入住（之後每天都住同一間，只有第 1 天 check-in）"
        },
        {
          id: 6, time: "18:00", name: "火神燒肉",
          lat: 24.7896256, lng: 125.2797295,
          mapUrl: "https://www.google.com/maps/place/%E7%81%AB%E7%A5%9E%E7%87%92%E8%82%89/@24.7896304,125.2771546,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4546d5929dfd1:0x4bfd38a20f62c908!8m2!3d24.7896256!4d125.2797295!16s%2Fg%2F11b7h9gxs1",
          address: "Matsubara-548-1 Hirara, Okinawa 906-0014 日本",
          hours: "17:00–23:00（L.O.22:00）", phone: null,
          reservation: "[booking.ebica.jp 預約連結](https://booking.ebica.jp/websrv/search/e014172801/32412?affiid=glb)／預定名稱：inamura chizumi／預定時間：18:00",
          article: "[Threads 引用](https://www.threads.com/@chiao_1108_/post/DaCmeYOj5x7)",
          note: "還沒定位"
        },
        {
          id: 7, time: null, name: "永旺城宮古南購物中心",
          lat: 24.7877418, lng: 125.2806897,
          mapUrl: "https://www.google.com/maps/place/%E6%B0%B8%E6%97%BA%E5%9F%8E%E5%AE%AE%E5%8F%A4%E5%8D%97%E8%B3%BC%E7%89%A9%E4%B8%AD%E5%BF%83/@24.7877466,125.2781148,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4546d3260ae07:0xb0133e304f216bf3!8m2!3d24.7877418!4d125.2806897!16s%2Fg%2F121gpqmd",
          address: "Matsubara-631 Hirara, Okinawa 906-0014 日本",
          hours: "每家店不同／DAISO：09:00–21:00", phone: null, reservation: null, article: null, note: null
        },
        {
          id: 8, time: null, name: "唐吉訶德 宮古島店",
          lat: 24.7925269, lng: 125.3015506,
          mapUrl: "https://www.google.com/maps/place/%E5%94%90%E5%90%89%E8%A8%B6%E5%BE%B7+%E5%AE%AE%E5%8F%A4%E5%B3%B6%E5%BA%97/@24.7925317,125.2989757,17z/data=!3m1!4b1!4m6!3m5!1s0x34f45400473d64e1:0xd58e06fa88f47a99!8m2!3d24.7925269!4d125.3015506!16s%2Fg%2F11c48mw5m9",
          address: "Nishizato-1283 Hirara, Okinawa 906-0012 日本",
          hours: "08:00–翌03:00", phone: null, reservation: null, article: null,
          note: "無（有專屬折價券）"
        }
      ]
    },

    /* ---------------- 第 2 天 ---------------- */
    {
      date: "2026-10-03",
      title: null,
      stops: [
        {
          id: 9, time: null, name: "SUNDAYS Miyakojima",
          lat: 24.8025916, lng: 125.2832623,
          mapUrl: "https://www.google.com/maps/place/SUNDAYS+Miyakojima/@24.8025964,125.2806874,17z/data=!3m1!4b1!4m6!3m5!1s0x34f453a5f14ea917:0x7b91ca7b5560bc07!8m2!3d24.8025916!4d125.2832623!16s%2Fg%2F11h21zg4_j",
          address: "〒906-0012 Okinawa, Miyakojima, Hirara, Nishizato-561 Hotel385 1F 日本",
          hours: "11:00–17:00", phone: "+81 980-79-5085", reservation: null, article: null,
          note: "宮古牛漢堡"
        },
        {
          id: 10, time: "14:30–16:30", name: "UNI BEACH（完潛，集合地點）",
          lat: 24.8013675, lng: 125.2636718,
          mapUrl: "https://www.google.com/maps/place/%E5%AE%AE%E5%8F%A4%E5%B3%B6%E9%87%A3%E3%82%8A%E8%88%B9PANANA/@24.8013723,125.2610969,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4557c1c971e39:0x4f02a9d18f8a0f6b!8m2!3d24.8013675!4d125.2636718!16s%2Fg%2F11t7tgn43k",
          address: "宮古島釣り船PANANA（集合地點：圖里巴碼頭）",
          hours: null, phone: null,
          reservation: "[kkday 預約連結](https://www.kkday.com/zh-tw/order/show/26KK219244847)／kkday預定／預定時間：14:30",
          article: null, note: null
        },
        {
          id: 11, time: null, name: "Twuriba Marina",
          lat: 24.8024303, lng: 125.2632222,
          mapUrl: "https://www.google.com/maps/place/Twuriba+Marina/@24.8024351,125.2606473,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4547ee1d150f7:0xe912bca8f98783a5!8m2!3d24.8024303!4d125.2632222!16s%2Fg%2F11c1ndc35g",
          address: "Miyakojima, Okinawa 906-0000 日本",
          hours: null, phone: null, reservation: null, article: null,
          note: "海岸"
        },
        {
          id: 12, time: "20:00", name: "預計銀河拍照",
          lat: null, lng: null, mapUrl: null, address: null,
          hours: null, phone: null,
          reservation: "Line預定／預定時間：20:00",
          article: null,
          note: "地點待定，依當天天氣決定拍攝地點"
        }
      ]
    },

    /* ---------------- 第 3 天 ---------------- */
    {
      date: "2026-10-04",
      title: null,
      stops: [
        {
          id: 13, time: null, name: "買東西吃",
          lat: null, lng: null, mapUrl: null, address: null,
          hours: null, phone: null, reservation: null, article: null, note: null
        },
        {
          id: 14, time: "10:30–11:00", name: "透明sup",
          lat: null, lng: null, mapUrl: null, address: null,
          hours: null, phone: null, reservation: null,
          article: "[cheerful-miyakojima.com](https://cheerful-miyakojima.com/)",
          note: "看天氣換 sup 地點，前一天會寄信通知最終地點，預計以下其一：【新城海岸 Aragusuku Beach】、【Imgyaa Marine Garden】、【與那霸前濱海灘北側 Yonaha Beach】。（先保留 13000 現金）。出發前先吃點東西"
        },
        {
          id: 15, time: null, name: "午餐待定",
          lat: null, lng: null, mapUrl: null, address: null,
          hours: null, phone: null, reservation: null, article: null,
          note: "原本預計吃宮古麵，但那家店週日應該是公休"
        },
        {
          id: 16, time: "20:30", name: "宮古牛燒肉 玉城",
          lat: 24.8042797, lng: 125.2790888,
          mapUrl: "https://maps.app.goo.gl/cLdavDG66CLrPydx5",
          address: "〒906-0013 Okinawa, Miyakojima, Hirara, Shimozato-3 セイルイン宮古島 1F 日本",
          hours: "17:00–23:00（L.O.22:00）", phone: "+81 980-79-5888",
          reservation: "[tabelog 連結](https://tabelog.com/tw/okinawa/A4705/A470503/47026386/)／預定名稱：inamura chizumi／預定時間：20:30／用餐時間90分",
          article: null,
          note: "宮古牛推薦，很多台灣人，要訂位。最後入店時間為21:30"
        }
      ]
    },

    /* ---------------- 第 4 天 ---------------- */
    {
      date: "2026-10-05",
      title: "隨便吃吃到處走走的一天",
      stops: [
        {
          id: 17, time: null, name: "Nakayukui Shoten（なかゆくい商店）",
          lat: 24.8258947, lng: 125.1700315,
          mapUrl: "https://www.google.com/maps/place/Nakayukui+Shoten/@24.8258995,125.1674566,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abcb0d49ccd3:0x6ba4be9a93fde287!8m2!3d24.8258947!4d125.1700315!16s%2Fg%2F11j8p7zvvp",
          address: "〒906-0505 Okinawa, Miyakojima, Irabu, Kuninaka-5 7-3 日本",
          hours: "09:30–12:00／13:30–16:00", phone: "+81 90-9476-3215", reservation: null, article: null,
          note: "好吃的甜甜圈🍩，一定要加冰淇淋"
        },
        {
          id: 18, time: null, name: "Gelato Cafe Ninufa",
          lat: 24.9299217, lng: 125.2334483,
          mapUrl: "https://www.google.com/maps/place/Gelato+Cafe+Ninufa/@24.9299265,125.2308734,17z/data=!3m1!4b1!4m6!3m5!1s0x34f44d173aba1493:0x51cb5fcedb4bcbca!8m2!3d24.9299217!4d125.2334483!16s%2Fg%2F11s0rd1nck",
          address: "Maezato-976-1 Hirara, Miyakojima, Okinawa 906-0422 日本",
          hours: "10:00–17:00", phone: "+81980795696", reservation: null,
          article: "[Threads 引用](https://www.threads.com/@chiao_1108_/post/DZ39mk9j1AF)",
          note: "池間島的 gelato，下去的海灘有很多寄居蟹"
        },
        {
          id: 19, time: "19:00", name: "HULAR（居酒屋）",
          lat: 24.804785, lng: 125.2780718,
          mapUrl: "https://www.google.com/maps/place/HULAR/@24.8047898,125.2754969,17z/data=!3m1!4b1!4m6!3m5!1s0x34f4533ebfa66a4b:0x71aa8034a7856d73!8m2!3d24.804785!4d125.2780718!16s%2Fg%2F11t9bx9f_6",
          address: "〒906-0013 Okinawa, Miyakojima, Hirara, Shimozato-3 3 日本",
          hours: "17:00–翌01:00（L.O. 翌00:30）", phone: "+81 980-79-0477",
          reservation: "[tabelog 連結](https://tabelog.com/okinawa/A4705/A470503/47029528/)／預定名稱：inamura chizumi／預定時間：19:00／用餐時間2小時",
          article: null,
          note: "要預約。營業 17:00-23:00，禮拜二休息"
        }
      ]
    },

    /* ---------------- 第 5 天 ---------------- */
    {
      date: "2026-10-06",
      title: null,
      stops: [
        {
          id: 20, time: null, name: "鶏白湯宮古そば屋&宿 ポークランチョンミート",
          lat: 24.8041413, lng: 125.2730864,
          mapUrl: "https://www.google.com/maps/place/%E3%83%9D%E3%83%BC%E3%82%AF%E3%83%A9%E3%83%B3%E3%83%81%E3%83%A7%E3%83%B3%E3%83%9F%E3%83%BC%E3%83%88/@24.8041461,125.2705115,17z/data=!4m9!3m8!1s0x34f45389a7d3019f:0x3efc8ffd1224574!5m2!4m1!1i2!8m2!3d24.8041413!4d125.2730864!16s%2Fg%2F11ckr_qxbz",
          address: "Shimozato-338-50 Hirara, Miyakojima, Okinawa 906-0013 日本",
          hours: "不定休 11:30–14:30（L.O.14:00）", phone: "+81 90-7945-0844", reservation: null, article: null,
          note: "無法預約，現金支付。拉麵評價很好。臨時休息會前一天在 IG 公告：[instagram.com/plm385](https://www.instagram.com/plm385/)"
        },
        {
          id: 21, time: "15:30–17:30", name: "浮潛 海龜（體驗地點：Shigira Beach Parking Lot）",
          lat: 24.7211266, lng: 125.3422371,
          mapUrl: "https://www.google.com/maps/place/Shigira+Beach+Parking+Lot/@24.7211315,125.3396622,17z/data=!3m1!4b1!4m6!3m5!1s0x34f45635fbf81901:0xd9f12228f0bf8f50!8m2!3d24.7211266!4d125.3422371!16s%2Fg%2F11bwqn39l1",
          address: "Ueno, Miyakojima, Okinawa 906-0000 日本",
          hours: null, phone: null,
          reservation: "[kkday 連結](https://www.kkday.com/zh-tw/product/36210-miyakojima-snorkeling-with-sea-turtles-okinawa-japan)／kkday預定／預定時間：15:30",
          article: null,
          note: "前一天看 KKDAY 訊息"
        },
        {
          id: 22, time: "19:30", name: "木炭烤肉 琉宮園",
          lat: 24.7207313, lng: 125.3342712,
          mapUrl: "https://www.google.com/maps/place/%E6%9C%A8%E7%82%AD%E7%83%A4%E8%82%89+%E7%90%89%E5%AE%AE%E5%9C%92/@24.7207362,125.3316963,17z/data=!3m1!4b1!4m6!3m5!1s0x34f45639b61a4077:0x49a416b450432064!8m2!3d24.7207313!4d125.3342712!16s%2Fg%2F1tkb2w91",
          address: "沖繩縣 宮古島市 上野 日本",
          hours: "17:00–22:00（L.O.21:30）", phone: null,
          reservation: "[tablecheck 預約連結](https://www.tablecheck.com/shops/shigira-ryuguen/reserve)／[地圖分享連結](https://share.google/NJBvgffvDZdv5V3ME)／預定名稱：inamura chizumi／預定時間：19:30／已預訂主廚無菜單料理套餐$12,000／先訂一個套餐其他到現場點",
          article: null,
          note: "要訂位"
        }
      ]
    },

    /* ---------------- 第 6 天 ---------------- */
    {
      date: "2026-10-07",
      title: null,
      stops: [
        {
          id: 23, time: null, name: "apollostation みなみ給油所／（有）豊見山石油",
          lat: 24.8288916, lng: 125.1680398,
          mapUrl: "https://www.google.com/maps/place/apollostation+%E3%81%BF%E3%81%AA%E3%81%BF%E7%B5%A6%E6%B2%B9%E6%89%80%EF%BC%8F%EF%BC%88%E6%9C%89%EF%BC%89%E8%B1%8A%E8%A6%8B%E5%B1%B1%E7%9F%B3%E6%B2%B9/@24.8288964,125.1654649,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5ab80898aaaf9:0xa5f5b52f41681cbf!8m2!3d24.8288916!4d125.1680398!16s%2Fg%2F1td7qyvc",
          address: "Nagahama-1413-5 Irabu, Miyakojima, Okinawa 906-0506 日本",
          hours: "08:00–18:00", phone: null, reservation: null, article: null,
          note: "加油站。旅館開到這裡要半小時"
        },
        {
          id: 24, time: "09:00", name: "MIYAKOJIMA ECO + Car Rental（還車）",
          lat: 24.8267045, lng: 125.1714631,
          mapUrl: "https://www.google.com/maps/place/MIYAKOJIMA+ECO+%2B+Car+Rental/@24.8267093,125.1688882,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abf48240783f:0x45ef0b215c3f509e!8m2!3d24.8267045!4d125.1714631!16s%2Fg%2F11v60l8_py",
          address: "Kuninaka-101-1 Irabu, Miyakojima, Okinawa 906-0505 日本",
          hours: "08:00–19:00", phone: "+81 980795625", reservation: null, article: null,
          note: "前一天先清潔。還車前先去加油（前一天or當天）。8點45還車 - 凹老闆接送。9點40關櫃"
        },
        {
          id: 25, time: "10:40", name: "下地島機場（出境）",
          lat: 24.8290343, lng: 125.1495618,
          mapUrl: "https://www.google.com/maps/place/%E4%B8%8B%E5%9C%B0%E5%B3%B6%E6%A9%9F%E5%A0%B4/@24.8290391,125.1469869,17z/data=!3m1!4b1!4m6!3m5!1s0x34f5abf2774fbddf:0x4052ebc4675369ff!8m2!3d24.8290343!4d125.1495618!16s%2Fm%2F03m5839",
          address: "Sawada-1727 Irabu, Miyakojima, Okinawa 906-0507 日本",
          hours: null, phone: null, reservation: null, article: null,
          note: "10:40-11:00"
        }
      ]
    }
  ]
};
