/* =========================================================
   Service Worker：讓網站可以安裝到主畫面，沒有網路時也能看行程。
   - 同網域的檔案：先上網拿最新版，拿不到才用手機裡的備份（network-first）。
   - 其他網域（Google 地圖、Apps Script 等）：完全不經手，照常連線。
   修改網站檔案後不需要改這裡；只有新增檔案時才要加進 SHELL。
   ========================================================= */
const CACHE = "miyako-v2"; // v2：2026-09 修正版（焦點／同步／地圖／對比）
const SHELL = [
  "./",
  "./index.html",
  "./itinerary.js",
  "./config.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("miyako-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 外部網站不處理

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetch(req, { cache: "no-cache" });
      if (fresh && fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === "navigate") {
        const page = await cache.match("./index.html") || await cache.match("./");
        if (page) return page;
      }
      throw err;
    }
  })());
});
