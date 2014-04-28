## tomatao framework

A small JavaScript framework that structures it's implementations around making business rules clearly visible and apparant.

####goals
- focus on business use cases
- lightweight decoupled architecture
- deferred module loading
- minimise ties to existing libraries
- allow ease of testing module components
- simplicity
- ease transition into ES6 and Web Components

####features

- a core function for extensions to plugin to
- app that leverages extensions and decouples from core
- modular architecture that plugin to app
- AOP features to compose modules

####install

1. clone
2. install bower-installer
3. run bower update
4. run bower-installer
5. view /tests

##Examples

#####Core Function

```javascript
Core = require('core');
var App = Core({
	// custom use cases
	// custom extensions
	// custom entities
});
	
```

#####App Object

```javascript
App.register('ExampleComponent', function(app){
	return {
		exampleFunction: function(){}
	};
});

App.register('ConstructorComponent', function(app){
	return new FunctionComponent({
		constructorArg: app.instance('ExampleComponent')
	});
});

```

```javascript
App.register('Component', function(app){
	return {
		apiFunction: function(){},
		onStart: function(){}
	}
},
{
	after: {
		'use.UI': {
			'start': 'onStart'
		}
	},
	before: {
		'ExampleComponent': {
			'exampleFunction': 'apiFunction'
		}
	},
	around: {
		'apiFunction': {
			'AnotherComponent': 'aroundAdvice'
		}
	}
})
```