'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.json": "7eec9097731b1c640ecb24cf5cbfb433",
"assets/AssetManifest.smcbin": "e796f5f97c823b6ebfde67c858c56e40",
"assets/assets/background/background.jpg": "f992098f56ee804c7c5226a5492f41a3",
"assets/assets/background/background_long.jpg": "c33351a961785941ed1c44e83992e8b1",
"assets/assets/background/Banner.png": "1d7abccf2bd0c25d5fafbb07a3d669f1",
"assets/assets/background/cards.png": "404a8a3d3acc9bd01a07f7d51c47d037",
"assets/assets/background/self-learn.jpeg": "7f66942d4fc3e4dc9c96347d400468f6",
"assets/assets/fonts/Tajawal/Tajawal-Black.ttf": "bc674767a78d2808b19a818d9742a4af",
"assets/assets/fonts/Tajawal/Tajawal-Bold.ttf": "76f83be859d749342ba420e1bb010d6a",
"assets/assets/fonts/Tajawal/Tajawal-ExtraBold.ttf": "066a37467c3af47d359507f7c7976071",
"assets/assets/fonts/Tajawal/Tajawal-ExtraLight.ttf": "cce1763b8395a41d57dfdf63a2e97e62",
"assets/assets/fonts/Tajawal/Tajawal-Light.ttf": "b6f8ed4fd29cc11d562ce730712aeaae",
"assets/assets/fonts/Tajawal/Tajawal-Medium.ttf": "3358032dd0994cf4a2116f0b16f80d70",
"assets/assets/fonts/Tajawal/Tajawal-Regular.ttf": "e3fe295c55a0cb720f766bccc5eecf63",
"assets/assets/icons/Group%2520219.png": "d4c9dbc80c8a56b20853168c36bda9dc",
"assets/assets/icons/Group%2520220.png": "44792b67f81d1f6cd60d819d395ff7e3",
"assets/assets/icons/Group%2520227.png": "7808d5c6c0a23aea5625328b78a9f0a1",
"assets/assets/icons/Group%2520228.png": "25501dba86dc5ac576f8c02e398242a1",
"assets/assets/icons/Group%2520229.png": "8f85f50f7bb8e3b5a4bc0f478823b67f",
"assets/assets/icons/Group%2520230.png": "3836d3db71414270ccf5d32ab2cba367",
"assets/assets/icons/Group%25202460.png": "ae8b88e8d25c3e9e0796fba5879aaba5",
"assets/assets/icons/Group%25202461.png": "1c16a5eee1f3c954f08b232529237435",
"assets/assets/icons/Logo.png": "c6a5a7f4cb15ade4a31e744d8e8b777f",
"assets/assets/icons/projects.png": "b82b46aeea22c6c491dc7edac31977df",
"assets/assets/icons/rank.png": "24d946d54cdd5c4e831b8eaf15c6ccb4",
"assets/FontManifest.json": "3969ab7f69f2d37275f6cab92ce7d790",
"assets/fonts/MaterialIcons-Regular.otf": "c80620ebc5bef17df8c1f38cb3f1f8f0",
"assets/NOTICES": "e65d8b46c7bcb04628e232c57a975146",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "f1ac3e4b7800eb0d9ac7f26b2698b857",
"/": "f1ac3e4b7800eb0d9ac7f26b2698b857",
"main.dart.js": "9cf93b1aa61f5dec1568023867403336",
"manifest.json": "13b4849267179197688c2ae11cf66989",
"version.json": "b84bfacea45aa7ea88d72a94140b97f4"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
