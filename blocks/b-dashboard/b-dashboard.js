/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-dashboard', {

    onSetMod : {
        'js' : function() {
            var bDashboard = this;
            this.findBlockInside('b-search').on('searched', function(e, data){
                bDashboard
                    .clearTracks()
                    .appendTracks(data);
            })

            BEM.blocks['b-serp-item'].on('selected', function(e){
                BEM.blocks['b-playlist'].getCurrent().add(e.block.track());
            })

            BEM.blocks['b-playlist'].on('birth', function(e, data){
                BEM.DOM.append(bDashboard.elem('playlists'), data.html);
            })
        }
    },
    clearTracks: function() {
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

}, {});

})();
