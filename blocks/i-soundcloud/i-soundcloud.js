/** @requires BEM */

(function() {

BEM.decl('i-soundcloud', {

    onSetMod : {
        'js' : function() {

            /* BEM Singleton :-) */
            return this.__self._single || (this.__self._single = this, this.initialize(), this);

        }
    },

    initialize: function() {

        SC.initialize({
            client_id: '2ffbaf9479281e4b80bd1e929162dcea',
        });

    }

}

);

})();
