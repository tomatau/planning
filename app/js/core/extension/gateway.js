var DefaultGateway;

function NotImplementedError(message) {
    this.name = "NotImplementedError";
    this.message = (message || "");
    // IE don't have a stack property until you actually throw the error.
    var stack;
    try {
        throw new Error(this.message);
    } catch (e) {
        stack = e.stack;
    }
    this.stack = stack;
}
NotImplementedError.prototype = new Error();
NotImplementedError.prototype.name = NotImplementedError.name;
NotImplementedError.prototype.constructor = NotImplementedError;

// NotImplementedError.prototype = Object.create(Error.prototype);

DefaultGateway = function DefaultGatewayFn(app){
    app.entity = function(name){
        throw new NotImplementedError();
        // return an entity by name
        // otherwise return a collection/gateway
    }
}

module.exports = DefaultGateway;