/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-search', {

    val: function() {
        return this.elem('input').val();
    },

    doSearch: function(e) {
        // A method to search
        e.preventDefault();
        SC.get('/tracks', { q: 'buskers', license: 'cc-by-sa' }, function(tracks) {
          console.log(tracks);
        });
        console.log('I am searching', this.val());
    }

}, {

    live : function() {

        SC.initialize({
            client_id: '2ffbaf9479281e4b80bd1e929162dcea',
            redirect_uri: 'http://sc.toivonen.veged.dev.yandex.ru/index.html'
        });

        SC.connect(function() {
          SC.get('/me', function(me) { 
              alert('Hello, ' + me.username); 
            });
        });

        this.liveInitOnEvent('submit')
            .liveBindTo('submit', function(e){
                this.doSearch(e);
            })
    }

});

})();
