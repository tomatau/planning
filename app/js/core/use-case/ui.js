var UI;
// want to remove these inter module deps
require('utilities/argsToArr');
/* 
- acts as a boundary providing hooks for modules
############## */
UI = function(app){
    return {
        start: function(){},
        error: function(error){  return error; },
        msg: function(msg){ return msg; },
        // HIGH CHANCE WE DONT WANT TRIGGER BY DEFAULT
        //  probably do though as AOP doesn't condition on the arguments passed in
        //      trigger can
        show: function(item){
            this.trigger.apply(
                this, ['show:' + item].concat(
                    argsToArr(arguments, 1)
                    // Array.prototype.slice.call(arguments, 1)
                )
            );
        },
        hide: function(item){
            this.trigger.apply(
                this, ['hide:' + item].concat(
                    argsToArr(arguments, 1)
                    // Array.prototype.slice.call(arguments, 1)
                )
            );
        },
        trigger: function(name){} // could extend a base entity class
    }
};

module.exports = UI;