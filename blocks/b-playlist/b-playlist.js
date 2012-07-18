/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-playlist', {

    onSetMod : {
        'js' : function() {

            /* Whatching for changes in input */
            BEM.blocks['b-form-input'].on(this.elem('title'), 'change', function() {
                console.log('input changed');
            });

            /* Toggling input editable/none */
            BEM.blocks['b-form-input'].on(this.elem('title'), 'focus blur', function() {
                this.toggleMod(this.elem('title'), 'action', 'editing', 'none')
            }, this);

        },

        'state' : {

            'current' : function() {

                /* Removing 'current' state from previous 'current' list */

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
            // chosing for a first track in the list
            this.play(this.findElem('track')[0].onclick()['trackId']);
            return;
        }
        var bPlaylist = this,
            track = this.getTrack(id),
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

    setTrack: function(track, html) {
        this.getTrack();
        var prev = this.findElem('track').last()[0];
        var prevId = prev ? prev.onclick()['trackId'] : 0;
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

    getTrack: function(id) {
        this._tracksIndex = this._tracksIndex || {};
        return this._tracksIndex[id];
    },

    delTrack: function(id) {
        // removing from Index
        var track = this.getTrack(id),
            prev = this.getTrack(track.prev),
            next = this.getTrack(track.next);
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
        this.getTrack(track.id) || this.setTrack(track, html) && BEM.DOM.append(this.elem('songs'), html);
        this.setMod(this.elem('play'), 'state', 'ready');
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
