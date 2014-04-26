module.exports = function startFn() {
    var context = this._context();

    // add all instances first
    context.registry.forEach(
        function(instance, index, array){
            // add instance
            context.instances[instance.name] = instance.init(this);
        }.bind(this)
    );

    // then add all advice
    context.registry.forEach(
        function(instance, index, array){
            addAdvice.call(this, context, instance);
        }.bind(this)
    );
}


/**
 * add advice to the current function
 * @param {object} context  the current context object
 * @param {object} instance the current instance's configuration
 */
function addAdvice(context, instance){
    var thisInstance = this.instance(instance.name)
        ,adviceType
        ,keySplit
        ,targetInstance
        ,targetFunction
        ,advice
        ;

    // go through each instance.aop
    if ( instance.advice != null ) {
        for ( adviceType in instance.advice ) {
            iterateOverAdviceTypes.call(this);
        }
    }
    // - - - - - -
    function iterateOverAdviceTypes() {
        for ( adviceKey in instance.advice[adviceType] ) {
            if ( (keySplit = adviceKey.split('.')).length > 1 ) {
                if ( keySplit[0] === "use" ) {
                    adviceOnUseCaseToCurrent.call(this);
                } else { /* dot notation for something else */ }
            } else {
                // if the key is on the instances... it must be the target
                if ( adviceKey in context.instances ) {
                    adviceOnOtherToCurrent.call(this);
                } 
                // if the key isn't on the instance, it must be a function on current
                else {
                    adviceOnThisToDestination.call(this);
                }
            }
        }
    }

    /**
     * Add Advice On A Use Case to current instance
     */
    function adviceOnUseCaseToCurrent(){
        targetInstance = this[keySplit[1]];

        iterateAdviceObject(function(key, destinationFunction){
            targetFunction = key;
            destinationInstance = thisInstance;

            advice = getAdvice( adviceType, destinationInstance, destinationFunction );
            this.aop.multi( targetInstance, targetFunction, advice );
        }.bind(this));   
    }

    /**
     * Add Advice On Another to current instance
     */
    function adviceOnOtherToCurrent(){
        targetInstance = context.instances[adviceKey];

        iterateAdviceObject(function(key, destinationFunction){
            targetFunction = key;
            destinationInstance = thisInstance;

            advice = getAdvice( adviceType, destinationInstance, destinationFunction );
            this.aop.multi( targetInstance, targetFunction, advice );
        }.bind(this));
    }

    /**
     * Add Advice On The Current Instance to the destination
     */
    function adviceOnThisToDestination(){
        targetInstance = thisInstance;
        targetFunction = adviceKey;
        
        iterateAdviceObject(function(key, destinationFunction){
            destinationInstance = ( (keySplit = key.split('.')).length > 1 )
                ? this[keySplit[1]]
                : this.instance(key);

            advice = getAdvice( adviceType, destinationInstance, destinationFunction );
            this.aop.multi( targetInstance, targetFunction, advice );
        }.bind(this));
    }

    // Iterate over the current advice object
    function iterateAdviceObject(callback) {
        for ( var adviceValuePair in instance.advice[adviceType][adviceKey] )
            callback(
                adviceValuePair, instance.advice[adviceType][adviceKey][adviceValuePair]
            );
    }

    function getAdvice(type, instance, callbackName) {
        var adv = {};
        return adv[type] = instance[callbackName], adv;
    }
}