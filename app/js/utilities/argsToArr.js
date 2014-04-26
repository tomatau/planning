(function(){
    if ( ! Object.prototype.hasOwnProperty(window, 'argsToArr') ) {
        window.argsToArr = function(args, idx){
            return idx = (idx || 0), [].splice.call(args, idx);
        };
    }
}).call(this);
