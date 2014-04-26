var UI = require('core/use-case/ui');

var expect = chai.expect;

describe('Default UI Use Case', function () {
    var namespace;
    // ui start
    // ui stop ??
    before(function () {
        UI = UI({});
    });
    
    beforeEach(function () {
        namespace = 'TestNamespace';
    });
    
    it('should provide - error handling method', function () {
        UI.error.should.be.a('function');
    });
    
    it('should provide - msg handling method', function () {
        UI.msg.should.be.a('function');
    });

    describe('UI "show" method', function () {
        var triggerSpy;

        before(function () {
             sinon.spy(UI, 'trigger');
        });

        after(function () {
            UI.trigger.reset();
        });

        after(function () {
            UI.trigger.restore();
        });

        it('should trigger show on the provided namespace', function () {
            UI.show(namespace);
            UI.trigger.should.have.been.calledWith('show:' + namespace);
        });

        it('shoudld pass any other arguments through the trigger', function () {
            var customArg1 = {},
                customArg2 = {};
            UI.show(namespace, customArg1, customArg2);

            UI.trigger.should.have.been.calledWith('show:' + namespace, customArg1, customArg2);
        });

        it('hide should have similar behaviour', function () {
            var customArg1 = {},
                customArg2 = {};
            UI.hide(namespace, customArg1, customArg2);

            UI.trigger.should.have.been.calledWith('hide:' + namespace, customArg1, customArg2);
        });
    });

});