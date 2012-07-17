/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-playlist', {

    onSetMod : {
        'js' : function() {
            this.bindTo('play', 'click', function() {
                console.log(this.tracks());
            })
        }
    },

    tracks: function(track) {
        this._tracks = this._tracks || {};
        if (track !== undefined) {
            this._tracks[track.id] = track;
        }
        return this._tracks;
    },

    add: function(track) {
        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            js: false,
            elem: 'track'
        }));
        this.tracks()[track.id] || this.tracks(track) && BEM.DOM.append(this.elem('songs'), html);
    }

}, {

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
