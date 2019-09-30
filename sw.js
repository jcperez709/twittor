//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_STATIC = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'

];

const APP_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e =>{

    const cacheStatic = caches.open(STATIC_CACHE)
    .then(cache => {
        cache.addAll(APP_STATIC);
    });

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
    .then(cache => {
        cache.addAll(APP_INMUTABLE);
    });

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e =>{
    //Borrar todos los caches estatisco que son diferentes al de la última instalación
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key =>{
            //Se compara contra el nombre del cache estatico instalado
            if(key !== STATIC_CACHE &&  key.includes( 'static' )){
                return caches.delete(key);
            };
            //Se compara contra el nombre del cache dinamico instalado
            if(key !== DYNAMIC_CACHE &&  key.includes( 'dynamic' )){
                return caches.delete(key);
            };        });
    });

    e.waitUntil(respuesta);    
});

self.addEventListener('fetch', e =>{

    const respuesta = caches.match(e.request).then( res =>{
        
        if(res){
            return res;
        }else{
            return fetch(e.request).then(newRes => {
                actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes.clone()); 
                return newRes;
            });
        }

    });
    e.respondWith(respuesta);
});