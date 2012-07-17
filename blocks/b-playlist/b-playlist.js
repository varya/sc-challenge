/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-playlist', {

    onSetMod : {
        'js' : function() {
            this.bindTo('play', 'click', this.play);
        }
    },

    play: function() {
        console.log(this.tracks());
        $.each(this.elem('track'), function(i, trackNode){
            console.log(trackNode);
        })
    },

    tracks: function(track) {
        this._tracks = this._tracks || (this.track(), []);
        if (track !== undefined) {
            this._tracksIndex[track.id] = track;
            this._tracks.push(track);
        }
        return this._tracks;
    },

    track: function(id) {
        this._tracksIndex = this._tracksIndex || {};
        return this._tracksIndex[id];
    },

    add: function(track) {
        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            js: false,
            elem: 'track'
        }));
        this.track(track.id) || this.tracks(track) && BEM.DOM.append(this.elem('songs'), html);
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
