
//imports
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';




//en el APP_SHELL pongo todo lo que va en el static cache 
//todo lo que necesita mi app para funcionar y que lo actualizo y modifico yo, 
//todos los file, img, y mas

const APP_SHELL = [
    // '/',
    '/index.html',
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


// en el siguente APP_SHELL pongo tood lo que va en el INMUTABLE
// que no sera modifcado nunca

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//Instalacion del SW


self.addEventListener('install', e => {

    // almasenamos en el cache el app_shell (cache static) y el inmutable
    const cacheStatic = caches.open( STATIC_CACHE ).then(cache =>
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache =>
        cache.addAll( APP_SHELL_INMUTABLE ));


    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );
    
});

// lo siguente borra los caches viejos

self.addEventListener('activate', e => {
    
    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            // se agrega "key.includes('static')" para que borre solo los static y no todos los demas
            // por ejemplo el dinamico y el inmutable
            if ( key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil( respuesta );
});

self.addEventListener( 'fetch', e => {

const respuesta = caches.match( e.request ).then( res => {

    if ( res ) {
        return res;
    } else {

        return fetch( e.request ).then( newRes => {

            return actualizarCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

        });

    }


});





    e.respondWith( respuesta );

});