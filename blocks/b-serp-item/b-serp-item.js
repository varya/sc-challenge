/** @requires BEM.DOM */

(function() {

/* Item of SERP */
BEM.DOM.decl('b-serp-item', {

    /* Sets or get a track to/from property */
    track: function(track) {

        return (track && (this._track = track), this._track);

    }

}, {

    live: function() {

        /* Inits only when a user clicks */
        this.liveBindTo('click', function(){
            this.trigger('selected');
        })

    },

    /* Builds a new item of SERP */
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
