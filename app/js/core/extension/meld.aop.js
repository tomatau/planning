var MeldAop;

var meld = require('meld'),
    api;

MeldAop = function AopFn(app){
    app.aop = api;
}

module.exports = MeldAop;

api = {
    _super: meld, // used in testing
    before: function(){
        return this._super.before.apply(this._super, arguments);
    },
    after: function(){
        return this._super.after.apply(this._super, arguments);
    },
    around: function(){
        return this._super.around.apply(this._super, arguments);
    },
    returning: function(){
        return this._super.afterReturning.apply(this._super, arguments);
    },
    throwing: function(){
        return this._super.afterThrowing.apply(this._super, arguments);
    },
    multi: function(target, match, aspects){
        if ( aspects != null && aspects.throwing ) {
            aspects.afterThrowing = aspects.throwing;
            delete aspects.throwing;
        }
        if ( aspects != null && aspects.returning ) {
            aspects.afterFulfilling = aspects.returning;
            delete aspects.returning;
        }
        return this._super.apply(this._super, arguments);
    }
}