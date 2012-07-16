/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-search', {

    val: function() {
        return this.elem('input').val();
    },

    doSearch: function(e) {
        // A method to search
        e.preventDefault();
        SC.get('/tracks', { genres: 'punk', bpm: { from: 120 } }, function(tracks) {
          console.log(tracks);
        });
        console.log('I am searching', this.val());
    }

}, {

    live : function() {

        this.liveInitOnEvent('submit')
            .liveBindTo('submit', function(e){
                this.doSearch(e);
            })
    }

});

})();
