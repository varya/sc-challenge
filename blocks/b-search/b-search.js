/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-search', {

    doSearch: function(e) {
        // A method to search
        e.preventDefault();
        console.log('I am searching');
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
