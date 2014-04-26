var App;

var Core = require('core'),
    config = require('main/app.config');

App = Core(config);

module.exports = App;