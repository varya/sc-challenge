/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-playlist', {

    onSetMod : {
        'js' : function() {
            /* ... */
        }
    }

}, {

    live : function() {
        /* ... */
    },

    getCurrent: function() {
        var cl = BEM.blocks['b-playlist'];
        return cl.current || cl.createUntitled();
    },

    createUntitled: function() {
        // creating a list
        var html = BEMHTML.apply({
            block: 'b-playlist',
            mods: { state: 'current' },
            title: 'Untitled'
        });
        console.log(html);
    }

});

})();
