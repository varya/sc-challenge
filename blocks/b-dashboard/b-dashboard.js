/** @requires BEM.DOM */

(function() {

var _storage = BEM.blocks['i-storage'];

/* Block-container for the application */
BEM.DOM.decl('b-dashboard', {

    onSetMod : {

        'js' : function() {

            /* Adding selected track to a current playlist */
            BEM.blocks['b-serp-item'].on('selected', function(e){
                BEM.blocks['b-playlist'].getCurrent().addTrack(e.block.track());
            })

            /* Appening a new playlist when it's born */
            BEM.blocks['b-playlist'].on('birth', function(e, data){
                BEM.DOM.append(this.elem('playlists'), data.html);
            }, this);

            /* Saving when a new playlist occurs or is dead */
            BEM.blocks['b-playlist'].on('birth death', function(e){
                this._save();
            }, this);

            _storage.getItem('suggest') || this.setMod(this.elem('suggest'), 'visibility', 'visible');

            var lists = _storage.getItem('playlists');
            lists && lists.forEach(function(id){
                BEM.blocks['b-playlist'].createNew(id);
            })

        }

    },

    /* Clears searchfield */
    _clearTracks: function() {

        BEM.DOM.destruct(this.findBlocksInside('searchfield', 'b-serp-item').reduce(function(res, block) {
            res = res.add(block.domElem);
        }, $()));

        return this;

    },

    /* Appends new tracks to the result */
    _appendTracks: function(tracks) {

        var bDashboard = this;

        tracks.forEach(function(track){
            var html = $(BEM.blocks['b-serp-item'].buildFromSearchResult(track));
            html.bem('b-serp-item').track(track);
            BEM.DOM.append(bDashboard.elem('searchfield'), html)
        })

        return this;
    },

    _save: function() {

        _storage.setItem('playlists', this._allLists());

    },

    _allLists: function() {

        var lists = [];
        this.findBlocksInside('b-playlist').forEach(function(block){
            lists.push(block.params['uniqId']);
        });

        return lists;

    }

}, {

    /* init only when necessaty */
    live: function() {

        /* init Dashboard when searched */
        this.liveInitOnBlockInsideEvent('searched', 'b-search', function(e, data) {
                this
                    ._clearTracks()
                    ._appendTracks(data);
            })
        /* init Dashboard when playlist added */
            .liveBindTo('pl-add', 'click', function(){
                BEM.blocks['b-playlist'].createNew().setMod('state', 'current');
            })
            .liveBindTo('suggest', 'click', function(){
                this.setMod(this.elem('suggest'), 'visibility', 'hidden');
                _storage.setItem('suggest', true);
            });

        return false; /* Init anyway */

    }

});

})();
