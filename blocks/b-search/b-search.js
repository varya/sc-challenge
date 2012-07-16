/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-search', {}, {

    live : function() {
        this.liveInitOnEvent('submit') 
            .liveBindTo('submit', function(e){
                e.preventDefault();
            })
    }

});

})();
