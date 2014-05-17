var Core;

// core functions
var startContext = require('./startContext');

// Use Cases and Extensions
var UI = require('./use-case/ui')
    ,defaultAOP = require('./extension/meld.aop')
    ,defaultGateway = require('./extension/gateway')
    ;

// load the config
module.exports = Core = function(config){
    // build the core
    var app = {
        // registration
        register: registerFn,
        instance: instanceFn,
        // events
        start: function(){
            startContext.call(this, getCurrentContext());
        },
        // module / service
        module: moduleFn
    };

    // make use cases first class properties?
    // kind of want to remove this dude too
    // also, yes, namespace to use cases... really 
    app.UI = UI(app);
    
    var itr;

    // want to remove these from here really
    defaultAOP(app);
    defaultGateway(app);

    // these two things can be a recursable function if
    //  / take out keys from config that aren't in app already

    // go through each use case and add it
    if ( config && config.useCase != null ) {
        for (itr in config.useCase) {
            app[itr] = config.useCase[itr](app);
        }
    }

    // go through each extension and execute it
    if ( config && config.extension != null ) {
        for (itr in config.extension) {
            config.extension[itr](app);
        }
    }

    return app;
}

///////////////
// Functions //
///////////////
function registerFn(config) {
    var context = getCurrentContext();
    context.registry.push(config);
}

// this should also check the root context
function instanceFn(name) {
    return getCurrentContext().instances[name];
}

function moduleFn(name) {
    currentContext = name;
    contexts[name] = {
        registry: [],
        instances: {}
    }
}


/////////////
// Private //
/////////////
var contexts = {
    root: {
        registry: [],
        instances: {}
    }
};

var currentContext;

function getContextName() {
    return currentContext != null ? currentContext : 'root';
}

function getCurrentContext(){
    return contexts[getContextName()];
}

/*

laws of form:
#############
it would be nice if everything tried to adhere to the natural form we see
fibonacci of how trees and rivers seem to branch out, etc..

size ~ return from previous ~ things provided

1 - loading
1 - moduleLoader
2 - core        = config, function
3 - app         = ui-useCase, root context, start
3 - defaults    = register, instance, module
 / gateway, aop, (promises, comms, dom, events )

3 - config      = useCases, extensions, entities
5 - module      = config, useCase, entities, models, views

// thinking...
#############

var config = {
    // map singleton usecase object literals directly onto app
    useCase: {
        UI: {
            show, error, msg
        }
    },

    // provide function extensions that modify app
    extension: {
        gateway: function(app){
            app.entity = {
                create, get, save, delete
            }
        }
    },
    
    // register a module, add extensions/useCases
        this makes no sense as we want to be able to register them later

    // view & model
    // some webapp extension
    // make use of promises

    // extension types have unique apis:
        // aop
            / before, after, then, done, notify, fail
        // promises
            / then, done, notify, fail
        // events
            / pub, sub

        // dom
            / LOADS
        // storage
            / get, set
        // comm-stream
            / (open, close,) send, recieve
        // comm-requests
            / post, get, put, delete
    ? web notifications
}

// 
Core() -> app

App
    / use cases
    start
    register
    instance
    / extension
    / module

UI Use Case
    show
    hide
    observe
    notify

Module / Service
    model
    view
    init

Gateway Extension
    collection
        wrap around Array object
    Entity [id]
        get
        create
        / [id]entity
            set/get
            update(save)
            delete

AOP Extensions
    before, after,
    around, multi,
    returning, throwing


// desire:
var Name = App.module('Name', { // use 'service' instead????
    after: {
        use.name: {
           'something': init
        }
    }
});

Name.view();

Name.model();

export = Name;

var Name = require('module/Name');

Name.init(); // modules have init which is kinda like start
// alternatively every module extends ui and has it's own start?

 */