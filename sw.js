/* Our Home service worker: precache the app shell, serve it offline.
 *
 * Rules this file follows, so a bad deploy or a flaky network can never
 * leave the installed app unable to open:
 *   - Only successful responses are ever written to the cache.
 *   - Every request path returns a real Response; never undefined.
 *   - Only the small core shell can fail the install. Images and icons
 *     are best-effort, so a missing file cannot block activation.
 */
const VERSION = "v5";
const SHELL_CACHE = `our-home-shell-${VERSION}`;
const RUNTIME_CACHE = `our-home-runtime-${VERSION}`;

// The app cannot run without these, so the install fails if any is missing.
const CORE = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest"];

// Nice to have offline, but never worth failing an install over.
const OPTIONAL = [
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./images/prayer-room.jpg",
  "./images/prayer-room-spec.jpg",
  "./images/study.jpg",
];

const OFFLINE_HTML =
  '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Our Home</title>' +
  "<style>body{margin:0;min-height:100vh;display:grid;place-items:center;text-align:center;padding:24px;" +
  "font-family:system-ui,sans-serif;background:#f6f1e7;color:#1f2430}" +
  "@media(prefers-color-scheme:dark){body{background:#151a24;color:#eee7d8}}" +
  "a{color:inherit}</style></head><body><div><h1>Our Home</h1>" +
  "<p>This page could not load, and there is no saved copy yet.</p>" +
  '<p><a href="./">Try again</a> &middot; <a href="./?reset">Reset the app</a></p>' +
  "</div></body></html>";

function offlinePage() {
  return new Response(OFFLINE_HTML, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// A response worth storing: a real success from our own origin or a CORS fetch.
function storable(response) {
  return Boolean(
    response &&
      response.ok &&
      response.status === 200 &&
      (response.type === "basic" || response.type === "default" || response.type === "cors")
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await cache.addAll(CORE);
      // Best effort: one missing image must not stop the worker activating.
      await Promise.allSettled(OPTIONAL.map((url) => cache.add(url)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Lets the page tell a waiting worker to take over immediately.
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Navigations: prefer the network so updates land, but never show a
  // server error page when a good saved copy exists.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (storable(response)) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(SHELL_CACHE).then((cache) => cache.put("./index.html", copy))
            );
            return response;
          }
          // A 404 or 5xx (a deploy in flight, say): fall back to the saved app.
          const saved = (await caches.match("./index.html")) || (await caches.match("./"));
          return saved || response;
        } catch {
          const saved = (await caches.match("./index.html")) || (await caches.match("./"));
          return saved || offlinePage();
        }
      })()
    );
    return;
  }

  // Same-origin assets: serve the saved copy at once, refresh behind it.
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) {
          event.waitUntil(
            (async () => {
              try {
                const fresh = await fetch(request);
                if (storable(fresh)) {
                  const cache = await caches.open(SHELL_CACHE);
                  await cache.put(request, fresh.clone());
                }
              } catch {
                /* offline: the saved copy stands */
              }
            })()
          );
          return cached;
        }
        try {
          const response = await fetch(request);
          if (storable(response)) {
            const copy = response.clone();
            event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy)));
          }
          return response;
        } catch {
          return new Response("", { status: 504, statusText: "Offline" });
        }
      })()
    );
    return;
  }

  // Fonts: saved copy first, then the network, and never a hard failure.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (storable(response)) await cache.put(request, response.clone());
          return response;
        } catch {
          return new Response("", { status: 504, statusText: "Offline" });
        }
      })()
    );
  }
});
