var Core = require('core/core');

var expect = chai.expect;

/*
    Main Premise:
    - Use Cases provide high level business logic
    - Entities provide low level business logic
    - Modules provide groups of business logic
    - Artisitc value isn't measurable i.e. not in business logic (observer paradox)
    - .: Views (model/template/event) should be tested in visual isolation
    - Extensions encapsulate services
 */

describe('Core Function', function () {
    it('should return an App object', function () {
        Core().should.be.an('object');
    });

    /*
        Use cases are intented to be singleton objects
     */
    describe('"Use Cases" in config', function(){
        it('should create - useCase keys on the returned app object', function () {
            var testUseCase = {},
                testConfig = {
                    useCase: {
                        testUseCase: function(app){ return testUseCase }
                    }
                };
            Core(testConfig).testUseCase.should.equal(testUseCase);
        });
    });

    /*
        Extensions plugin add functionality
     */
    describe('"Extensions" in config', function () {
        var testExtension = function testExtensionFn(app){
            app.testModification = 1;
        };

        it('should modify app when in config', function () {
            var testConfig = {
                extension: {
                    test: testExtension
                }
            };
            var app = Core(testConfig);
            app.should.have.property('testModification')
        });
    });

    /*
        Contexts provide:
            - registration of arrays/objects/functions/numbers
            - Injection through callbacks
            - DSL around functional AOP
     */

    /*
        Default Pieces of the Core
     */
    describe('Defaults', function () {
        describe('"UI" Use Case', function () {
            it('should have - default UI use case', function () {
                Core().should.have.property('UI');
            });
        });
        
        describe('"Entity" Extension', function(){
            it('should have a default entity extension', function () {
                Core().entity.should.be.a('function');
            });
        });

        describe('"AOP" Extension', function () {
            it('should have an aop api of methods', function () {
                Core().aop.should.contain.keys(
                    'before', 'after', 'multi', 'around', 'returning', 'throwing'
                );
            });
        });
    });

    /*
        Register sub contexts that add functionality
     */
    describe('Module Function', function(){
        var App;

        beforeEach(function () {
            App = Core();
        });

        it('should have a module register function', function () {
            Core().module.should.be.a('function');
        });

        it.skip('should have a start function accepting entities and use cases', function () {
            
        });

        describe('Registered Modules', function () {
            // it('should make a new register context and set it as current', function () {
            //     App.module('TestModule');
            //     App._contextName().should.eql('TestModule');
            // });

            // modules can be loaded after App.start
            // .: they should have their own start function
            // 
            // they need use cases (always singletons)
            // and entities
            // can be passed in a config
            describe('Module Contexts', function () {
                
                beforeEach(function () {
                    App = Core();
                    App.module('TestModule');
                });

                it.skip('should protect against inter module communication', function () {
                    
                });

                it.skip('should allow access to root context', function () {
                    
                });

                it.skip('should register child contexts', function () {
                    
                });

                it.skip('should allow access to parent and root context', function () {
                    
                });
                
                it.skip('should register sub modules', function () {});
            });
        });

        // should make a kind of app??
    });
});
