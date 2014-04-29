module.exports = function startFn(context) {
    // var args = ['context', 'rootContext', 'parentContext'];
    //  // maybe a 'get from context instead?'

    // add all instances first
    context.registry.forEach(
        function(instance, index, array){
            context.instances[instance.name] = instance.init(this);
        }.bind(this)
    );

    // then add all advice
    context.registry.forEach(
        function(instance, index, array){
            addAdvice.call(this, context, instance);
        }.bind(this)
    );

    this.UI.start();
}


/**
 * add advice to the current function
 * @param {object} context  the current context object
 * @param {object} instance the current instance's configuration
 */
function addAdvice(context, instance){
    var thisInstance = context.instances[instance.name]
        ,adviceType
        ,innerKeySplit
        ,adviceKeySplit
        ,targetInstance
        ,targetFunction
        ,advice
        ;

    if ( instance.advice != null ) {
        for ( adviceType in instance.advice ) {
            iterateOverAdviceTypes.call(this);
        }
    }
    // - - - - - -
    function iterateOverAdviceTypes() {
        for ( adviceKey in instance.advice[adviceType] ) {
            if ( (adviceKeySplit = adviceKey.split('.')).length > 1 ) {
                if ( adviceKeySplit[0] === "use" ) {
                    adviceOnUseCaseToCurrent.call(this);
                } else { /* dot notation for something else */ }
            } else {
                // if the key is on the instances... it must be the target
            // TODO: should check root context if not current
                if ( adviceKey in context.instances ) {
                    adviceOnOtherToCurrent.call(this);
                } 
                // if the key isn't on the instance, it must be a function on current
                else {
                    adviceOnCurrentToOther.call(this);
                }
            }
        }
    }

    /**
     * Add Advice on a Use Case doing current instance function
     */
    function adviceOnUseCaseToCurrent(){
        // adviceKeySplit (targetInstance)
        // / targetFunction
        // 
        // / adviceType
        // thisInstance (destinationInstance)
        // / destinationFunction
        targetInstance = this[adviceKeySplit[1]];
        destinationInstance = thisInstance;

        iterateAdviceObject(function(key, destinationFunction){
            targetFunction = key;

            advice = getAdvice( adviceType, destinationInstance, destinationFunction );
            this.aop.multi( targetInstance, targetFunction, advice );
        }.bind(this));   
    }

    /**
     * Add Advice on another instance doing current instance function
     */
    function adviceOnOtherToCurrent(){
        // adviceKey (targetInstance)
        // / targetFunction
        // 
        // 
        // / adviceType
        // thisOnstance (destinationInstance)
        // / destinationFunction
        // 
        // / context
                    // maybe root context instead???
        targetInstance = context.instances[adviceKey];
        destinationInstance = thisInstance;

        iterateAdviceObject(function(key, destinationFunction){
            targetFunction = key;

            advice = getAdvice( adviceType, destinationInstance, destinationFunction );
            this.aop.multi( targetInstance, targetFunction, advice );
        }.bind(this));
    }

    /**
     * Add Advice on the current instance doing another instance function
     */
    function adviceOnCurrentToOther(){
        // thisInstance (targetInstance)
        // adviceKey (targetFunction)
        // 
        // / adviceType
        // (destinationInstance)
        // (destinationFunction)
        // 
        // context
        targetInstance = thisInstance;
        targetFunction = adviceKey;
        
        iterateAdviceObject(function(key, destinationFunction){
            destinationInstance = ( (innerKeySplit = key.split('.')).length > 1 )
                ? this[innerKeySplit[1]]
                : context.instances[key];

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