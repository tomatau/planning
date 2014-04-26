// wrapper around a rest library or something
var RestGateway;

// var _ = require('underscore');

// this can be some function for registering the extension
RestGateway = function RestGatewayFn(config){
    this.baseURL = config.baseURL;
}

/////////
// API //
/////////
/*
    create - return an entity extending the class
*/
// _.extend(RestGateway.prototype, {
//     create: function(entityName, entityID){},
// });

module.exports = RestGateway;