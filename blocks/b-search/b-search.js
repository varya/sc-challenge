/** @requires BEM.DOM */

(function() {

/* A block to search tracks */
BEM.DOM.decl('b-search', {

    val: function() {
        return this.elem('input').val();
    },

    /* Searching with SC API */
    doSearch: function(e) {

        e.preventDefault();

        var bSearch = this;
        SC.get('/tracks', { q: this.val()}, function(tracks) {
            bSearch.trigger('searched', tracks)
        });

    }

}, {

    /* Init when necessary */
    live : function() {

        SC.initialize({
            client_id: '2ffbaf9479281e4b80bd1e929162dcea',
            redirect_uri: 'http://sc.toivonen.veged.dev.yandex.ru/index.html'
        });

        /* Init when a from is submitted */
        this.liveInitOnEvent('submit')
            .liveBindTo('submit', function(e){
                this.doSearch(e);
            })
    }

});

})();
