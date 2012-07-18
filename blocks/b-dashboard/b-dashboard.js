/** @requires BEM.DOM */

(function() {

/* Block-container for the application */
BEM.DOM.decl('b-dashboard', {

    onSetMod : {

        'js' : function() {

            var bDashboard = this;

            /* Adding selected track to a current playlist */
            BEM.blocks['b-serp-item'].on('selected', function(e){
                BEM.blocks['b-playlist'].getCurrent().add(e.block.track());
            })

            /* Appening a new playlist when it's born */
            BEM.blocks['b-playlist'].on('birth', function(e, data){
                BEM.DOM.append(bDashboard.elem('playlists'), data.html);
            })

        }

    },

    _clearTracks: function() {
        $.each(this.findBlocksInside('searchfield', 'b-serp-item'), function(i, item) {
            item.remove();
        })
        return this;
    },

    appendTracks: function(tracks) {
        var bDashboard = this;
        $.each(tracks, function(i, track){
            var html = $(BEM.blocks['b-serp-item'].buildFromSearchResult(track));
            html.bem('b-serp-item').track(track);
            BEM.DOM.append(bDashboard.elem('searchfield'), html)
        })

        return this;
    }

}, {
    live: function() {

        /* init Dashboard when searched */
        this.liveInitOnBlockInsideEvent('searched', 'b-search', function(e, data) {
                this
                    ._clearTracks()
                    .appendTracks(data);
            })
        /* init Dashboard when playlist added */
            .liveBindTo('pl-add', 'click', function(){
                BEM.blocks['b-playlist'].createNew().setMod('state', 'current');
            })

    }

});

})();
