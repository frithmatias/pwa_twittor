importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// ! Una ruta que no exista aborta la instalación del APP_SHELL  

let swRoot = '';
self.location.hostname === 'localhost' ? swRoot = '' : swRoot = '/pwa_twittor';
console.log('LOCATION', self.location.hostname);
console.log('swRoot', swRoot);
const APP_SHELL = [
    // '/', // ! falla en GitHub Pages
    swRoot + '/index.html',
    swRoot + '/manifest.json',
    swRoot + '/css/style.css',
    swRoot + '/img/favicon.ico',
    swRoot + '/img/avatars/chicken.png',
    swRoot + '/img/avatars/crab.png',
    swRoot + '/img/avatars/donkey.png',
    swRoot + '/img/avatars/frog.png',
    swRoot + '/img/avatars/turtle.png',
    swRoot + '/js/app.js',
    swRoot + '/js/sw-utils.js'
]

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    swRoot + '/css/animate.css',
    swRoot + '/js/libs/jquery.js'
]

self.addEventListener('install', e => {
    const cacheStatic = caches.open( STATIC_CACHE ).then( cache => cache.addAll( APP_SHELL ));
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache => cache.addAll( APP_SHELL_INMUTABLE ));
    e.waitUntil(Promise.all([ cacheStatic, cacheInmutable ]));
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if ( key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
            if ( key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
        })
    })
    e.waitUntil( respuesta );
});

// strategy cache with network fallback 
self.addEventListener( 'fetch', e => {
    const respuesta = caches.match( e.request ).then( res => {
        if (res) {
            return res;
        } else {
            return fetch(e.request)
            .then(resp2 => {
                return actualizarCacheDinamico( DYNAMIC_CACHE, e.request, resp2 );
            })
            .catch(err => {
                console.log('Error ', err);
            })
        }
    });

    e.respondWith(respuesta);
})