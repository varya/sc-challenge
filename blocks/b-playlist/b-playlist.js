/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-playlist', {

    onSetMod : {
        'js' : function() {

            /* Whatching for changes in input */
            BEM.blocks['b-form-input'].on(this.elem('title desc'), 'change', function() {
                this._save();
            }, this);

            /* Toggling input editable/none */
            BEM.blocks['b-form-input'].on(this.elem('title'), 'focus blur', function() {
                this.toggleMod(this.elem('title'), 'action', 'editing', 'none')
            }, this);
            BEM.blocks['b-form-input'].on(this.elem('desc'), 'focus blur', function() {
                this.toggleMod(this.elem('desc'), 'action', 'editing', 'none')
            }, this);

        },

        'state' : {

            'current' : function() {

                var cur = this.__self._current;

                /* Removing 'current' state from previous 'current' list */
                cur && cur.delMod('state');

                /* Saving which is 'current' now */
                this.__self._current = this;

            },

            /* Saving state when 'current' is changed */
            '*' : function() {
                this.afterCurrentEvent(function(){
                    this._save();
                })
            }
        },
        'action' : {

            'playing' : function() {

                var playing = this.__self._playing;

                /* Stop playing what is now playing */
                playing && playing.setMod('action', 'none');

                this.play();

                this.setMod(this.elem('play'), 'action', 'playing');

                /* Remember the list which is playing now */
                this.__self._playing = this;

            },
            'none' : function() {

                this.sound && this.sound.stop();

                this.setMod(this.elem('play'), 'action', 'none');
                this.delMod(this.elem('track'), 'state')
            }
        }
    },

    onElemSetMod : {

        'play' : {

            'action' : {

                '*' : function(e, modName, modVal) {

                    /* Provide action to the list */
                    if(modVal == 'playing' || modVal == 'none') {
                        this.setMod('action', modVal);
                    }
                }

            }
        },

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

                    /* Mark the current list playing */
                    this.setMod('action', 'playing');

                }
            }
        }
    },

    setTitle: function(title) {

        this.findBlockInside(this.elem('title'), 'b-form-input').val(title);

        return this;

    },

    setDesc: function(desc) {

        this.findBlockInside(this.elem('desc'), 'b-form-input').val(desc);

        return this;

    },

    /* Method to play the list */
    play: function(id) {

        this._nowPlaying && this.sound.stop();

        /* Starts from the first */
        if (id === undefined) {

            /* Chosing for a first track in the list */
            this._firstTrack() && this.play(this._firstTrack());

            return;

        }
        if(id === null) {
            return;
        }

        var bPlaylist = this,
            track = this.getTrack(id),
            nextId = track.nextId;

        SC.stream("/tracks/" + id,
            {

                onplay: function() {

                    /* Marking current playing track */
                    bPlaylist._nowPlaying = id;
                    bPlaylist.setMod(bPlaylist.findElem(track.html, 'track'), 'state', 'current');

                },

                onfinish: function() {

                    bPlaylist.play(nextId);

                }

            },

            function(sound) {

                bPlaylist.sound = sound;

                sound.play();

            }
        );
    },

    /* Saving a Playlist */
    _save: function() {

        window.localStorage.setItem('playlist-' + this._uniqId, this._getShape());

    },

    _getShape: function() {

        var shape = {
            title: this.findBlockInside(this.elem('title'), 'b-form-input').val(),
            desc: this.findBlockInside(this.elem('desc'), 'b-form-input').val(),
            tracks: this.getTracks(),
            current: this.hasMod('state', 'current')
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
                nextId: null
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
            prev = this.getTrack(track.prevId),
            next = this.getTrack(track.nextId);

        prev && (prev.nextId = track.nextId);
        next && (next.prevId = track.prevId);

        track.html.remove();
        this._save();
        delete this._tracksIndex[id];

        if(id == this._nowPlaying) {
            this.play(track.nextId);
        }


    },

    /* Adding a new track */
    addTrack: function(track) {

        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            js: false,
            elem: 'track',
            attrs: { 'onclick' : 'return {"trackId" : ' + track.id + '}'},
            title: track.title
        }));

        this.getTrack(track.id) || this.setTrack(track, html) && BEM.DOM.append(this.elem('songs'), html);
        this._save();

    },

    /* Method for removing the current playlist */
    remove: function() {
        var de = this.domElem,
            sel = this.buildSelector(),
            prev = de.prev(sel),
            next = de.next(sel);
            newCurrent = prev.length ? prev : (next.length ? next : undefined);
        this.sound && this.sound.stop();
        this.afterCurrentEvent(function(){
            this.domElem.remove();
            newCurrent && $(newCurrent).bem('b-playlist').setMod('state', 'current');
            BEM.blocks['b-playlist'].trigger('death');
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
                this.toggleMod(e.data.domElem, 'action', 'none', 'playing');
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
    createNew: function(id) {

        var html = $(BEMHTML.apply({
            block: 'b-playlist',
            title: 'Untitled',
            desc: 'no description'
        }));
        BEM.blocks['b-playlist'].trigger('birth', { html: html });

        var list = html.bem('b-playlist');

        if (id) {
            var data = JSON.parse(window.localStorage.getItem('playlist-' + id));
            list.setTitle(data.title)
                .setDesc(data.desc);
            data.tracks.forEach(function(track){
                list.addTrack(track.track)
            });
            data.current && list.setMod('state', 'current');

        }

        list._save();

        return list;
    }


});

})();
