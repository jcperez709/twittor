function actualizaCacheDinamico(dinamicCache, req, res){
    if(res.ok){
        caches.open(dinamicCache).then( cache => {
            cache.put(req, res);            
        });
    }
}