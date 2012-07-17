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

            BEM.blocks['b-serp-item'].on('selected', function(){
                console.log('item selected');
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
        var html = '';
        $.each(tracks, function(i, track){
            html += BEM.blocks['b-serp-item'].buildFromSearchResult(track);
        })
        this.elem('searchfield').append(html);
        BEM.DOM.init(this.elem('searchfield'));

        return this;
    }

}, {});

})();
