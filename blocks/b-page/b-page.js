/** @requires BEM.DOM */

(function() {

BEM.DOM.decl('b-page', {

    onSetMod : {

        'js' : function() {

            /* Creating and appending b-dashboar block */
            BEM.DOM.append(this.domElem, BEMHTML.apply({
                block: 'b-dashboard'
            }));

        }
    }

});

})();
