/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst, NetworkOnly } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { mdiConsoleLine } from "@mdi/js";

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith("/_")) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Creamos base 
//self.addEventListener("activate", (event) => {

//  openDB('findemes', 1, {
//    upgrade(db) {
//      db.createObjectStore('balance', { keyPath: 'id', autoIncrement: true });
//      db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: true });
//      db.createObjectStore('total', { keyPath: 'id', autoIncrement: true });
//      console.log('Bases de datos y tablas creadas...');
//    },
//  });
//
//});

//Capturamos algunas consultas para poder trabajar offline
//registerRoute(({ url }) => {
//  return url.origin === 'https://devapi.findemes.ar' && url.pathname.startsWith('/api/v1/getlivedev');
//},
//  new NetworkFirst({
//    cacheName: "api-live",
//  })
//);

//registerRoute(new RegExp('https://devapi.findemes.ar/api/v1/getbalance'), function (event) {
//  fetch(event.url)
//    .then((response) => {
//      var cloneRes = response.clone()
//      console.log(cloneRes)
//      cloneRes.json()
//        .then((body) => {
//          //localforage.setItem(event.url.pathname, body)
//        })
//      return response
//   })
//    .catch(function (error) {
//      console.warn(`Constructing a fallback response, due to an error while fetching the real response:, ${error}`)
//      localforage.getItem(event.url.pathname)
//        .then((res) => {
//          let payload = new Response(JSON.stringify(res), {
//            "status": 200,
//            "statusText": "MyCustomResponse!"
//          })
//        console.log(payload)
//          return payload
//        })
//    })
//});

//registerRoute(
// Swap this out for whatever criteria you need.
//  ({ url }) => url.origin === 'https://devapi.findemes.ar' && url.pathname.startsWith('/api/v1/getbalance'),
// As before, this assumes that customResponseLogic()
// takes a FetchEvent and returns a Promise for a Response.
//({ event }) => customResponseLogic(event),
//({ request }) => customResponseLogic(request),
//({ response }) => customResponseLogic(response),

// Make sure you include 'POST' here!
//'POST'
//);

//function customResponseLogic(req) {
//    console.log(req);
//    req.clone.text().then(body => {
//      console.log('entra aca ?');
//      console.log(/    })
// Prevent the default, and handle the request ourselves.
//event.respondWith(async function() {
// Try to get the response from a cache.
//  const cachedResponse = await caches.match(event.request);
// Return it if we found one.
//  if (cachedResponse) return cachedResponse;
// If we didn't find a match in the cache, use the network.
//  return fetch(event.request);
//}());
//}

//registerRoute(({ url }) => {
//  url.origin === 'https://devapi.findemes.ar' && url.pathname.startsWith('/api/v1/getbalance').
//    fetch(url).then((response) => {
//      var cloneRes = response.clone()
//      console.log(cloneRes)
//      cloneRes.json()
//        .then((body) => {
//         //localforage.setItem(event.url.pathname, body)
//       })
//    return response
//  })
//  .catch(function (error) {
//    console.warn(`Constructing a fallback response, due to an error while fetching the real response:, ${error}`)
//    localforage.getItem(event.url.pathname)
//      .then((res) => {
//         let payload = new Response(JSON.stringify(res), {
//           "status": 200,
//           "statusText": "MyCustomResponse!"
//         })
//         console.log(payload)
//         return payload
//       })
//  })
//});

//new NetworkFirst({
//  cacheName: "api-balance",
//})
//);

//registerRoute(({ url }) => {
//  return url.origin === 'https://devapi.findemes.ar' && url.pathname.startsWith('/api/v1/gettotal');
//},
//  new NetworkFirst({
//    cacheName: "api-total",
//  })
//);

//registerRoute(({ url }) => {
//  return url.origin === 'https://devapi.findemes.ar' && url.pathname.startsWith('/api/v1/getcategorias');
//},
//  new NetworkFirst({
//    cacheName: "api-categorias",
//  })
//);

//if ('sync' in self.registration) {
//  console.log('Background sync is natively supported');
//}

// Capturamos las url para guardar datos offline.
//const bgSyncPlugin = new BackgroundSyncPlugin("POST-que", {
//  maxRetentionTime: 24 * 60,
//});

//registerRoute(({ url }) => {
//  return url.origin === 'https://devapi.findemes.ar' && url.pathname.startsWith('/api/v1/addmodbalance');
//},
//  new NetworkOnly({
//    plugins: [bgSyncPlugin],
//  }),
//  'POST'
//);
