/** @requires BEM */

(function() {

BEM.decl('i-soundcloud', {

    onSetMod : {
        'js' : function() {

            SC.initialize({
                client_id: '2ffbaf9479281e4b80bd1e929162dcea',
                redirect_uri: 'http://sc.toivonen.veged.dev.yandex.ru/index.html'
            });

        }
    }

}

);

})();
