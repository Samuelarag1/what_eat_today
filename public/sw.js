if(!self.define){let e,s={};const n=(n,t)=>(n=new URL(n+".js",t).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(t,i)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let c={};const r=e=>n(e,a),o={module:{uri:a},exports:c,require:r};s[a]=Promise.all(t.map((e=>o[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/ProtestStrike-Regular.ttf",revision:"13efba3e0bc1aca51205e8d292a72735"},{url:"/_next/app-build-manifest.json",revision:"e7c225108a6cb6d2a0b9719903517552"},{url:"/_next/static/Xr8138NfYRxYi0X7kHPhh/_buildManifest.js",revision:"d81809794c9f16ed4740bda2f21d9c02"},{url:"/_next/static/Xr8138NfYRxYi0X7kHPhh/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0e5ce63c-579890ec63d2f84e.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/215-3b0506debaad11e4.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/4bd1b696-792d8f648b56d866.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/526-f7003f889e019787.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/app/_not-found/page-cef9b7f13628309e.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/app/api/recipes/route-2a9d11a905eb7682.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/app/layout-55f3b7195a2603ac.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/app/page-75f6ceffd2b8ac26.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/framework-56c6fb34bb17b733.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/main-150f9181639f4e5f.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/main-app-5fb436898c474093.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-758bcd1bd3e11d44.js",revision:"Xr8138NfYRxYi0X7kHPhh"},{url:"/_next/static/css/9150d4fd584d0c36.css",revision:"9150d4fd584d0c36"},{url:"/_next/static/css/d244931220052b16.css",revision:"d244931220052b16"},{url:"/icon.png",revision:"74a359e71b08f0afc6884841d621060f"},{url:"/manifest.json",revision:"d41d8cd98f00b204e9800998ecf8427e"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
