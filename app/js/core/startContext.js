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
    var thisInstance = context.instances[instance.name];
    
    var aopMulti = function(targetInstance, targetFunction, advice){
        this.aop.multi(targetInstance, targetFunction, advice);
    }.bind(this);

    var getUseCase = function(useCase){
        return this[useCase];
    }.bind(this);


    if ( instance.advice != null ) {
        iterateOverAdvice(instance.advice);
    }

    // - - - - - -

    function iterateOverAdvice(advice){
        for ( var type in advice ) {
            iterateOverAdviceType( 
                advice[type], type
            );
        }
    }

    function iterateOverAdviceType(advice, type) {
        for ( var target in advice ) {
            addAdvice(
                target, advice[target], type
            );
        }
    }

    function addAdvice(target, destination, type) {
        var targetInstance, targetFunction,  destinationFunction,
            targetSplit; // try to remove this

        if ( (targetSplit = target.split(' ')).length > 1 ) {
            targetInstance = getTargetInstance(targetSplit)
            targetFunction = targetSplit[1];
            destinationFunction = getAdvice(type, thisInstance[destination]);
        } else {
            targetInstance = thisInstance;
            targetFunction = target;
            destinationFunction = getOtherAdvice(type, destination)
        }
        aopMulti(
            targetInstance,
            targetFunction,
            destinationFunction
        )
    }

    function getTargetInstance(targetSplit){
        var caseSplit;
        return ((caseSplit = targetSplit[0].split('.')).length > 1 )
            ? getUseCase(caseSplit[1])
            : context.instances[targetSplit[0]];
    }

    function getAdvice(type, destinationFunction){
        var advice = {};
        advice[type] = destinationFunction;
        return advice;
    }

    function getOtherAdvice(type, destination){
        destination = destination.split(' ');
        return getAdvice(type, ( (caseSplit = destination[0].split('.')).length > 1 )
            ? getUseCase(caseSplit[1])[destination[1]]
            : context.instances[destination[0]][destination[1]]
        );
    }
}