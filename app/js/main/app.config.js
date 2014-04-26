var config;

// pieces
var RestGateway = require('extensions/gateway.rest.js'), // optional
    DOM = 'DOM', // optional
    Events = 'Events', // optional but recommended
    AOP = 'AOP', // resorts to default
    Comms = 'Comms', // optional
    UI = 'UI' // resorts to default
    Promises = 'Promises' // resorts to default
    ;

config = {
    
    extensions: {

        gateway : {
            constructor: RestGateway,
            config: {
                baseURL: 'http://site.co.uk/rest'
            }
        },

        aop     : AOP
    },

    useCase: {
        ui: UI 
    }
};

module.exports = config;