/** @requires BEM */

(function() {

var storage = window.localStorage;

BEM.decl('i-storage', {}, {

    setItem: function(key, data) {
        storage.setItem(key, JSON.stringify(data));
    },

    getItem: function(key) {
        return JSON.parse(storage.getItem(key));
    }

});

})();
