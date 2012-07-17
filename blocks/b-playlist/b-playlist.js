/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-playlist', {

    onSetMod : {
        'js' : function() {
            var bPlaylist = this;
            this.bindTo('play', 'click', function(e) {
                if (bPlaylist.hasMod(e.data.domElem, 'state', 'ready')) {
                    this.play()
                }
            });
            this.__self.liveBindTo('trash', 'click', function(e){
                var trackId = e.data.domElem.closest(bPlaylist.buildSelector('track'))[0].onclick()['trackId'];
                bPlaylist.delTrack(trackId);
            })
        },
        'state' : {
            'current' : function() {
                if (this.__self._current) {
                    this.__self._current.delMod('state');
                }
                this.__self._current = this;
            }
        }
    },

    onElemSetMod : {
        'track' : {
            'state' : {
                'current' : function(elem) {
                    var prev = this.elem('track', 'state', 'current');
                    this
                        .delMod(prev, 'state')
                        .trigger('current', {
                            prev    : prev,
                            current : elem
                        });
                }
            }
        }
    },

    play: function(id) {
        // starts from the first
        if (!id) {
            this.play(this.tracks()[0].id);
            return;
        }
        var bPlaylist = this,
            track = this.track(id),
            nextId = track.nextId;
        SC.stream("/tracks/" + id,
            {
                onplay: function() {
                    bPlaylist.setMod(bPlaylist.findElem(track.html, 'track'), 'state', 'current');
                },
                onfinish: function() {
                    bPlaylist.play(nextId);
                }
            },
            function(sound) {
                sound.play();
            }
        );
    },

    tracks: function(track, html) {
        this._tracks = this._tracks || (this.track(), []);
        var prevId = this._tracks.length != 0 ? this._tracks[this._tracks.length - 1].id : 0;
        if (track !== undefined) {
            this._tracksIndex[track.id] = {
                prevId : prevId,
                track : track,
                html: html,
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

    delTrack: function(id) {
        // removing from Index
        var track = this.track(id),
            prev = this.track(track.prev),
            next = this.track(track.next);
        prev && (prev.nextId = track.nextId);
        next && (next.prevId = track.prevId);
        track.html.remove();
        delete this._tracksIndex[id];
    },

    add: function(track) {
        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            js: false,
            elem: 'track',
            attrs: { 'onclick' : 'return {"trackId" : ' + track.id + '}'},
            title: track.title
        }));
        this.track(track.id) || this.tracks(track, html) && BEM.DOM.append(this.elem('songs'), html);
        this.setMod(this.elem('play'), 'state', 'ready');
    }

}, {

    live: function() {
        this.liveBindTo('click', function(){
            this.setMod('state', 'current');
        });
    },

    getCurrent: function() {
        var cl = BEM.blocks['b-playlist'];
        if (!cl._current) {
            cl.createNew().setMod('state', 'current');
        }
        return cl._current;
    },

    createNew: function() {
        // creating a list
        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            title: 'Untitled'
        }));
        BEM.blocks['b-playlist'].trigger('birth', { html: html });
        return html.bem('b-playlist');
    }

});

})();
