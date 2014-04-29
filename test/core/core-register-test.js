var Core = require('core/core');

var expect = chai.expect;

/*
    Contexts provide:
        - registration of arrays/objects/functions/numbers
        - Injection through callbacks
        - DSL around functional AOP
 */
describe('Core Register Contexts', function () {
    var App,
        registerConfig,
        testReturn;

    beforeEach(function () {
        App = Core();
        registerConfig = {
            name: 'TestName',
            init: function(){}
        };
        testReturn = function(){};
        testPreviousInstance = function(){};
    });

    // it('should create a default register context "root"', function () {
    //     App.register.should.be.a('function');
    //     App._contextName().should.eql('root');
    // });

    it('should supply App to the registered callback on start', function (done) {
        registerConfig.init = function(app){
            app.should.equal(App);
            done();
        }
        App.register(registerConfig);
        App.start();
    });

    it("should provide instance accessor to callbacks return after start", function () {
        registerConfig.init = function(app){
            return testReturn;
        };
        App.register(registerConfig);
        App.start();
        App.instance('TestName').should.equal(testReturn);
    });

    it('should resolve previously registered instances inside init callbacks', function (done) {
        registerConfig.init = function(app){
            return testReturn;
        };
        var secondInstanceConfig = {
            // test with a number as a name because:
            name: '2', // different browsers resolve number names in different orders
            init: function(app){
                app.instance('TestName').should.equal(testReturn);
                done();
            }
        }
        App.register(registerConfig);
        App.register(secondInstanceConfig);
        App.start();
    });

    /////////////////////////////////////////////
    // Advice through DSL //
    /////////////////////////////////////////////
    describe('Registering With Advice', function () {

        var instanceAlreadyRegistered,
            instanceAlreadyRegisteredConfig,
            instanceBeingRegistered,
            instanceBeingRegisteredConfig;

        before(function () {
            sinon.stub(App.aop, 'multi');
        });

        after(function () {
            App.aop.multi.restore();
        });

        beforeEach(function registerPreviousInstance() {
            instanceAlreadyRegistered = {
                afterFunction: function afterFunctionFn(){},
                advicee: function adviceeFn(){},
            };
            instanceAlreadyRegisteredConfig = {
                name: 'InstanceAlreadyRegistered',
                init: function(){ return instanceAlreadyRegistered },
            };
            App.register(instanceAlreadyRegisteredConfig);
            App.aop.multi.reset();
        });

        beforeEach(function createTargetInstance() {
            instanceBeingRegistered = {
                advicee: function adviceeFn(){},
                afterFunction: function afterFunctionFn(){}
            };
            instanceBeingRegisteredConfig = {
                name: 'InstanceBeingRegistered',
                init: function(){ return instanceBeingRegistered },
            };
        });

        it('should add advice to instance being registered on start', function () {
            instanceBeingRegisteredConfig['advice'] = {
                after: {
                    'advicee': {
                        'InstanceAlreadyRegistered': 'afterFunction'
                    }
                }
            };
            App.register(instanceBeingRegisteredConfig);
            App.start();

            App.aop.multi.should.have.been.calledWith(
                instanceBeingRegistered, 'advicee', {
                    after: instanceAlreadyRegistered.afterFunction
                }
            );
        });

        it('should add advice on another object on start', function () {
            instanceBeingRegisteredConfig['advice'] = {
                after: {
                    'InstanceAlreadyRegistered': {
                        'advicee': 'afterFunction'
                    }
                }
            };
            App.register(instanceBeingRegisteredConfig);
            App.start();

            App.aop.multi.should.have.been.calledWith(
                instanceAlreadyRegistered, 'advicee', {
                    after: instanceBeingRegistered.afterFunction
                }
            );
        });

        it('should add advice to use case on start', function () {
            instanceBeingRegisteredConfig['advice'] = {
                after: {
                    'use.UI': {
                        'start': 'afterFunction'
                    }
                }
            };
            App.register(instanceBeingRegisteredConfig);
            App.start();
            App.aop.multi.should.have.been.calledWith(
                App.UI, 'start', {
                    after: instanceBeingRegistered.afterFunction
                }
            );
        });

        it('should add advice to instance being registered on start', function () {
            instanceBeingRegisteredConfig['advice'] = {
                after: {
                    'advicee': {
                        'use.UI': 'error'
                    }
                }
            };
            App.register(instanceBeingRegisteredConfig);
            App.start();

            App.aop.multi.should.have.been.calledWith(
                instanceBeingRegistered, 'advicee', {
                    after: App.UI.error
                }
            );
        });
    });
});