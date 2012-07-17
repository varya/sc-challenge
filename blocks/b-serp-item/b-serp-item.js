/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-serp-item', {

    remove: function() {
        this.domElem.remove();
        delete this;
    }

}, {

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
