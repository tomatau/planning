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
            init: function(){
                return testReturn;
            }
        };
        testReturn = function(){};
        testPreviousInstance = function(){};
    });

    describe('Dependency Management', function () {
        it('should supply App instance to init method', function (done) {
            registerConfig.init = function(app){
                app.should.equal(App);
                done();
            }
            App.register(registerConfig);
            App.start();
        });
        
        it("should get the init method's return when using instance()", function () {
            App.register(registerConfig);
            App.start();
            App.instance('TestName').should.equal(testReturn);
        });

        it('should resolve previously registered instances for injection', function (done) {
            var secondInstanceConfig = {
                // different browsers resolve 'number keys' in different orders/ways
                // so use a number here..
                name: '2', 
                init: function(app){
                    app.instance('TestName').should.equal(testReturn);
                    done();
                }
            }
            App.register(registerConfig);
            App.register(secondInstanceConfig);
            App.start();
        });
    });



    /////////////////////////////////////////////
    // Advice through DSL //
    /////////////////////////////////////////////
    describe('Registering With Advice', function () {
        var previosInstance,
            previosInstanceConfig,
            instanceBeingRegistered,
            instanceBeingRegisteredConfig;

        before(function () {
            sinon.stub(App.aop, 'multi');
        });

        after(function () {
            App.aop.multi.restore();
        });

        beforeEach(
            registerPreviousInstance
        );

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
                    'advicee': 'previosInstance afterFunction'
                }
            };
            App.register(instanceBeingRegisteredConfig);
            App.start();

            App.aop.multi.should.have.been.calledWith(
                instanceBeingRegistered, 'advicee', {
                    after: previosInstance.afterFunction
                }
            );
        });

        it('should add advice on another object on start', function () {
            instanceBeingRegisteredConfig['advice'] = {
                after: {
                    'previosInstance advicee': 'afterFunction'
                }
            };
            App.register(instanceBeingRegisteredConfig);
            App.start();

            App.aop.multi.should.have.been.calledWith(
                previosInstance, 'advicee', {
                    after: instanceBeingRegistered.afterFunction
                }
            );
        });

        it('should add advice to use case on start', function () {
            instanceBeingRegisteredConfig['advice'] = {
                after: {
                    'use.UI start': 'afterFunction'
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

        it('should add advice to instance being registered on useCase', function () {
            instanceBeingRegisteredConfig['advice'] = {
                after: {
                    'advicee': 'use.UI error'
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

        function registerPreviousInstance() {
            previosInstance = {
                afterFunction: function afterFunctionFn(){},
                advicee: function adviceeFn(){},
            };
            previosInstanceConfig = {
                name: 'previosInstance',
                init: function(){ return previosInstance },
            };
            App.register(previosInstanceConfig);
            App.aop.multi.reset();
        }
    });
});