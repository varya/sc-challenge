/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-playlist', {

    onSetMod : {
        'js' : function() {
            /* ... */
        }
    },

    setTracks: function(track) {
        this._track = this._track || {};
        this._track[track.id] = track;
    },

    getTracks: function() {
        return this._track;
    },

    add: function(track) {
        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            js: false,
            elem: 'track'
        }));
        this.setTracks(track);
        BEM.DOM.append(this.elem('songs'), html);
    }

}, {

    live : function() {
        /* ... */
    },

    getCurrent: function() {
        var cl = BEM.blocks['b-playlist'];
        return cl.current || (cl.current = cl.createUntitled(), cl.current);
    },

    createUntitled: function() {
        // creating a list
        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            mods: { state: 'current' },
            title: 'Untitled'
        }));
        BEM.blocks['b-playlist'].trigger('birth', { html: html });
        return html.bem('b-playlist');
    }

});

})();
