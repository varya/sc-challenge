/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-playlist', {

    onSetMod : {
        'js' : function() {
            this.bindTo('play', 'click', function() {
                    this.play()
                });
        }
    },

    play: function(id) {
        // starts from the first
        if (!id) {
            this.play(this.tracks()[0].id);
            return;
        }
        var bPlaylist = this,
            nextId = this.track(id).nextId;
        SC.stream("/tracks/" + id,
            {
                onfinish: function() {
                    bPlaylist.play(nextId);
                }
            },
            function(sound) {
                sound.play();
            }
        );
    },

    tracks: function(track) {
        this._tracks = this._tracks || (this.track(), []);
        var prevId = this._tracks.length != 0 ? this._tracks[this._tracks.length - 1].id : 0;
        if (track !== undefined) {
            this._tracksIndex[track.id] = {
                prevId : prevId,
                track : track,
                nextId: undefined
            };
            (prevId != 0) && (this._tracksIndex[prevId].nextId = track.id);
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
