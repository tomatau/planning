(function(){
    if ( ! Object.prototype.hasOwnProperty(window, 'argsToArr') ) {
        /**
         * creates a new array from arguments object starting at the idx
         * @param  {arguments}  args
         * @param  {number}     idx - start position default 1
         * @return {array}      new arguments array
         */
        window.argsToArr = function(args, idx){
            return idx = (idx || 0), [].slice.call(args, 0, idx);
        };
    }
}).call(this);
