/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-serp-item', {

    track: function(track) {
        // sets and gets a track
        if (track !== undefined) {
            this._track = track;
        }
        return this._track;
    },

    remove: function() {
        this.domElem.remove();
        delete this;
    }

}, {

    live: function() {
        this.liveBindTo('click', function(){
            this.trigger('selected');
        })
    },

    buildFromSearchResult: function(track) {
        return BEMHTML.apply({
            block: 'b-serp-item',
            title: track.title,
            description: track.description,
            user: track.user
        });
    }

});

})();
