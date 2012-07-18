/** @requires BEM */

(function() {

var storage = window.localStorage;

BEM.decl('i-storage', {

    onSetMod : {

        'js' : function() {

            /* BEM Singleton :-) */
            return this.__self._single || (this.__self._single = this, this);

        }

    },

    setItem: function(key, data) {
        storage.setItem(key, JSON.stringify(data));
    },

    getItem: function(key) {
        return JSON.parse(storage.getItem(key));
    }

});

})();
