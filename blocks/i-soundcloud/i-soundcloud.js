/** @requires BEM */

(function() {

BEM.decl('i-soundcloud', {}, {

    initialize: function() {

        /* Init only once */
        if(this._inited) {
            return;
        }

        SC.initialize({
            client_id: '2ffbaf9479281e4b80bd1e929162dcea',
        });
        this._inited = true;

    }

});

})();
