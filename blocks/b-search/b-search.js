/** @requires BEM.DOM */

(function() {

/* A block to search tracks */
BEM.DOM.decl('b-search', {

    onSetMod: {

        'js' : function() {
            BEM.blocks['i-soundcloud'].initialize();
        }
    },

    val: function() {
        return this.elem('input').val();
    },

    /* Searching with SC API */
    _doSearch: function(e) {

        e.preventDefault();

        var bSearch = this;
        SC.get('/tracks', { q: this.val()}, function(data) {
            if (data.errors) {
                data.errors.forEach(function(err){
                    alert(err.error_message)
                })
                return;
            }
            bSearch.trigger('searched', data)
        });

    }

}, {

    /* Init when necessary */
    live : function() {

        /* Init when a from is submitted */
        this.liveInitOnEvent('submit')
            .liveBindTo('submit', function(e){
                this._doSearch(e);
            })
    }

});

})();
