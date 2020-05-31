function actualizarCacheDinamico( dynamicCache, req, res ) {
    if ( res.ok ) {
        // * la respuesta tiene data que voy a almacenar en el cache 
        caches.open( dynamicCache ).then( cache => {
            cache.put( req, res.clone() );
            return res.clone();
        })
    } else {
        // ! falló el cache y falló la red 
        return res;
    }
}