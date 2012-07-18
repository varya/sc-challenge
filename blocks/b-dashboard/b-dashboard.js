/** @requires BEM.DOM */

(function() {

var _storage = BEM.create('i-storage');

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
            BEM.blocks['b-playlist'].on('birth death', function(e, data){
                this._save();
            }, this);

            var lists = _storage.getItem('playlists');
            lists && lists.forEach(function(id){
                BEM.blocks['b-playlist'].createNew(id);
            })

        }

    },

    /* Clears searchfield */
    _clearTracks: function() {

        $.each(this.findBlocksInside('searchfield', 'b-serp-item'), function(i, item) {
            item.remove();
        })
        return this;

    },

    /* Appends new tracks to the result */
    _appendTracks: function(tracks) {

        var bDashboard = this;

        $.each(tracks, function(i, track){
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
        $.each(this.findBlocksInside('b-playlist'), function(i, block){
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

        return false; /* Init anyway */

    }

});

})();
