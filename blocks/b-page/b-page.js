/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-page', {
    onSetMod : {
        'js' : function() {
            BEM.DOM.append(this.domElem, BEMHTML.apply({
                block: 'b-dashboard'
            }));
        }
    }
});

})();
