## tomatao framework

A small JavaScript framework that structures it's implementations around making business rules clearly visible and apparant.

####goals
- focus on business use cases
- lightweight
- deferred module loading for initial page load
- minimise ties to existing libraries
- decoupled to ease testing
- simplicity
- ease transition into ES6 and Web Components

####features

- a core function to create application objects
- app objects that leverage extensions supplied in config
- modular architecture that plugin to app
- AOP features to compose modules

####install

*disclaimer. Sorry that this is all built using the bower installer and so closely coupled with curl.js module loader.  I did this because it has features I use a lot for bundling in my projects and it's still a work in progress so far from worth making a dist*

1. clone
2. npm install bower-installer
3. bower update
4. bower-installer
5. open ./tests/index.php

####TODO

- Modules
- Entity gateway / Repository / Builder
- (ext)Promises
- (ext)Events
- Helper functions for views/models


---

---
###API
- core
- app
- use case
- extension
- module
- entity

*Please note that anything listed in the above 'todo' is not implemented yet and purely shown in the API section to demonstrate the expected API as it currently stands.*


#### Core([config]);

Creates and returns a '*root*' App object.

If the config contains Use Cases, Entities and Extensions, they will be applied to the returned App object.

```javascript
var Core = require('core');
var App = Core({
    useCases: {
        // overwrite the default UI use-case
        UI: require('./foobar.js');
    },
    extensions: {
        // overwrite the default AOP
        AOP: require('./my-aop-implementation.js');
    },
    entities: {
        // add a business object
        bobTheBusOb: require('./maximum-value-business-rules.js');
    }
});
```

#### var App;

**start()** - Will start the application running.  Do this after you have set everything up.

**register(config)** - Will register a component using the config onto the app.

```javascript
App.register({
    // registers the return from init with following name
    name: 'MyModel',
    // callback to create the instance, accepts App object
    init: function(app){
        return {
            update: function(){}
        }
    }
});

App.register({
    name: 'componentName',
    init: function(app){
        return new require('./my-component.js')({
            dependencyDerp: app.instance('otherComponent');
        });
    },
    // optional:
    // wrap methods using AOP
    advice: {
        before: {
            // access 'root' use case's methods
            'use.UI start': 'functionOnComponentName'
        },
        after: {
            // target methods on other components
            'functionOnComponentName': 'MyModel update'
        }
    },
    namespace: 'something'    
})
```
The AOP can access any root UseCases as well as any 'root' instances although this is not advised - see modules.

**instance('componentName')** - Will return the registered component; this is useful for managing dependencies as you can wire up different implamentations for the component that will be resolved.

#### UseCase;

require them into the application via the core or module config.

There is a default UI use case as most things need some form of interface; this can be wired up to some repl, gui or even have ajax events triggered by it... WHATVER.
```javascript
module.exports = UI = function(app){
    return {
        start: function(){},
        show: function(){},
        hide: function(){}
    }
}
```

You should add new use-cases for different tasks that the rest of the application will require!  If only a small part of the application needs to work with the use case then consider a smaller module/service that has it's own use case.  You can always move these use cases into the 'root' later if their scope grows.

One nice example may be to build different applications for mobile and desktop but completely reuse your javascript business logic through the use cases.  Just make the different UI version listen to the same UI Use Case methods.

Use cases are not designed to be easily unit testable as they will often require many components such as the gateway, promises, events and potentially any other extension you add to the app. 

#### Extensions;

Extensions are functions used to plug into the application, they will be called on App.start and given the opportunity to decorate the returned root application object.  Yes,... there is a risk of collisions here.

Default extensions are kept to a small number: just the AOP, gateways and whatever else.

TBA: Once modules have been implemented, the gateway extension will be implemented; the API may try to somehow resolve collisions using 'extension' types in some-way but I'm yet to reach that epiphany.

#### var Module;

Modules plugin to an app object, they can communicate between their components internally and with parent modules.  The only way for modules to communicate externally is through use cases in 'root'.

Use cases may wish to extend root or parent use cases but the extension should not be available to other modules.

**init()** - starts the module.

**< sugar >()** - shortcut for register with namespace

```javascript
var HerpModule = App.module({
    name: 'HerpModule',
    parentModule: 'AnotherModule', // optional, defaults to root
    // same as config for app
    useCases: {},
    extensions: {},
    entities: {},
    // use sugar for convenient naming 
    // e.g. categories of components or mvc
    sugar: ['sugar', 'view', 'model']
});
```
Sugar will make a new sugar method for Module register that will
namespace the component.

Modules have all the functionality of App, except they cannot communicate with other modules!  Only their parents!

You can override or extend any parent configuration useCases, extensions or entities as they will be passed in.

```javascript
HerpModule.sugar('ExampleComponent', 
function(app){ // app instance here is current module
	return {
		exampleFunction: function(){}
	};
});
```

e.g. implement some error handling from ui interactions:
```javascript
var ErrorMessageComponent = function(args){
    this.helper = args.helper;
    this.displayError = function(error){}
}

HerpModule.view('ErrorMessageComponent', 
{
    returning: {
        'use.UI error': 'displayError'
    }
},
function(app){
	return new ErrorMessageComponent({
		helper: app.sugar('ExampleComponent')
	});
});

```

e.g. obj literal component with multiple advice
```javascript
HerpModule.model('Donkeys', 
{
	after: {
		'use.UI display:farm': 'getDonkeys',
		'getDonkeys': 'use.Operations showHerp'
	},
	before: {
		'ExampleComponent exampleFunction': 'apiFunction'
	},
	around: {
		'apiFunction': 'AnotherComponent aroundAdvice'
	}
},
function(app){
	return {
	    donkeys: [],
		apiFunction: function(){},
		onStart: function(){}
	}
});
```