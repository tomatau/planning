(function(){
    if ( ! Object.prototype.hasOwnProperty(window, 'log') ) {
        window.log = function() {
            log.history = log.history || [];   // store logs to an array for reference
            log.history.push(arguments);
            if ( this.console ) {
                console.log.apply(console, Array.prototype.slice.call(arguments) );
            }
        };
    }

    // Avoid `console` errors in browsers that lack a console.
    (function() {
        var method;
        var noop = function () {};
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }());
}).call(this);
