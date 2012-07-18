/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-playlist', {

    onSetMod : {
        'js' : function() {

            /* Whatching for changes in input */
            BEM.blocks['b-form-input'].on(this.elem('title'), 'change', function() {
                this._save();
            }, this);

            /* Toggling input editable/none */
            BEM.blocks['b-form-input'].on(this.elem('title'), 'focus blur', function() {
                this.toggleMod(this.elem('title'), 'action', 'editing', 'none')
            }, this);

        },

        'state' : {

            'current' : function() {

                var cur = this.__self._current;

                /* Removing 'current' state from previous 'current' list */
                cur && cur.delMod('state');

                /* Saving which is 'current' now */
                this.__self._current = this;

            }
        }
    },

    onElemSetMod : {

        'track' : {

            'state' : {

                'current' : function(elem) {

                    /* Only one 'current' track is possible */
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

    /* Method to play the list */
    play: function(id) {

        /* Starts from the first */
        if (!id) {

            /* Chosing for a first track in the list */
            this.play(this._firstTrack());

            return;

        }

        var bPlaylist = this,
            track = this.getTrack(id),
            nextId = track.nextId;

        SC.stream("/tracks/" + id,
            {

                onplay: function() {

                    /* Marking current playing track */
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

    /* Saving a Playlist */
    _save: function() {

        window.localStorage.setItem('playlist-' + this._uniqId, this._getShape());
        console.log('from storage', window.localStorage.getItem('playlist-' + this._uniqId));

    },

    _getShape: function() {

        var shape = {
            title: this.findBlockInside(this.elem('title'), 'b-form-input').val(),
            tracks: this.getTracks()
        }

        return JSON.stringify(shape);
    },

    /* Setting a track to a Playlist */
    setTrack: function(track, html) {

        this.getTrack(); /* To be sure that track has exists */

        var prev = this.findElem('track').last()[0],
            prevId = prev ? prev.onclick()['trackId'] : 0;

        if (track !== undefined) {
            this._tracksIndex[track.id] = {
                prevId : prevId,
                track : track,
                html: html,
                nextId: undefined
            };
            (prevId != 0) && (this._tracksIndex[prevId].nextId = track.id);
            return this.getTrack(track.id);
        }
    },

    /* Getting a track object by id */
    getTrack: function(id) {

        this._tracksIndex = this._tracksIndex || {};

        return this._tracksIndex[id];

    },

    /* Getting the first track */
    _firstTrack: function() {

        var first = this.findElem('track')[0];

        return first && first.onclick()['trackId'];

    },

    /* Getting all the tracks in a playlist */
    getTracks: function() {
        var id = this._firstTrack(),
            tracks = [];
        while(id != undefined) {
            var track = this.getTrack(id);
            tracks.push({
                prevId : track.prevId,
                track : {
                    id: track.track.id,
                    title: track.track.title
                },
                nextId: track.nextId
            });
            id = track.nextId;
        }
        return tracks;
    },

    /* Removing a track from hash */
    delTrack: function(id) {

        var track = this.getTrack(id),
            prev = this.getTrack(track.prev),
            next = this.getTrack(track.next);

        prev && (prev.nextId = track.nextId);
        next && (next.prevId = track.prevId);

        track.html.remove();
        delete this._tracksIndex[id];

    },

    /* Adding a new track */
    add: function(track) {

        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            js: false,
            elem: 'track',
            attrs: { 'onclick' : 'return {"trackId" : ' + track.id + '}'},
            title: track.title
        }));

        this.getTrack(track.id) || this.setTrack(track, html) && BEM.DOM.append(this.elem('songs'), html);
        this.setMod(this.elem('play'), 'state', 'ready');
        this._save();

    },

    /* Method for removing the current playlist */
    remove: function() {
        var de = this.domElem,
            sel = this.buildSelector(),
            prev = de.prev(sel),
            next = de.next(sel);
            newCurrent = prev.length ? prev : (next.length ? next : undefined)
        this.afterCurrentEvent(function(){
            this.domElem.remove();
            $(newCurrent).bem('b-playlist').setMod('state', 'current');
        });
    }

}, {

    live: function() {

        /* Init if a user clicks */
        this.liveBindTo('click', function(){
                this.setMod('state', 'current');
            })
        /* Init if the trash button is used */
            .liveBindTo('trash', 'click', function(e){
                var trackId = e.data.domElem.closest(this.buildSelector('track'))[0].onclick()['trackId'];
                this.delTrack(trackId);
            })
        /* Init if the play button is clicked */
            .liveBindTo('play', 'click', function(e) {
                if (this.hasMod(e.data.domElem, 'state', 'ready')) {
                    this.play();
                }
            })
        /* Init if trash-all button is presed */
            .liveBindTo('trash-all', 'click', function(){
                this.remove();
            });

    },

    /* Return current Playlist */
    getCurrent: function() {

        var cl = BEM.blocks['b-playlist'];
        if (!cl._current) {
            cl.createNew().setMod('state', 'current');
        }
        return cl._current;

    },

    /* Creating a new Playlist */
    createNew: function() {

        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            title: 'Untitled'
        }));
        BEM.blocks['b-playlist'].trigger('birth', { html: html });

        var list = html.bem('b-playlist');

        list._save();

        return list;
    }

});

})();
