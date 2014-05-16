var App;

var Core = require('core'),
    config = require('main/app.config');

try {
    App = Core(config);
} catch (e) {
    console.dir(e);
}

module.exports = App;