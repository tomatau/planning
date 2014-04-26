var AOP = require('core/extension/meld.aop');

var expect = chai.expect;

/////////////////////////////////////////
// This file should just stub out meld //
/////////////////////////////////////////

describe('AOP', function () {
    var originalFunction,
        functionSpy,
        app,
        testData = []
        ;

    beforeEach(function () {
        originalFunction = function(){};
        functionSpy = sinon.spy();
        app = {};
        AOP(app);
    });

    afterEach(function () {
    });

    describe('multiple advice', function () {
        it.skip('should add multiple advices', function () {
            var ob = {
                    fn: function(){
                        return 'testString'
                    }
                };
            app.aop.multi(ob, 'fn', {
                around: function(joinpoint){
                    var result = joinpoint.proceed(testData);
                },
                throwing: function(){}
            });
            ob.fn();
        });
    });
    
    describe('before', function () {
        it('should create advised functions', function () {
            var advisedFunc = app.aop.before(originalFunction, function(args){
                    args.should.equal(testData);
                });

            advisedFunc(testData);
        });

        it('should put advice onto objects', function () {
            var ob = {
                    fn: function(){}
                };

            app.aop.before(ob, 'fn', function(args){
                args.should.equal(testData);
            });
            
            ob.fn(testData);
        });
    });

    describe('after', function () {
        it('should create advised functions', function () {
            var originalFunction = function(){
                    return testData; 
                },
                advisedFunc = app.aop.after(originalFunction, function(args){
                    args.should.equal(testData);
                });

            advisedFunc();
        });

        it('should put advice onto objects', function () {
            var ob = {
                    fn: function(){
                        return testData
                    }
                };

            app.aop.after(ob, 'fn', function(args){
                args.should.equal(testData);
            });
            
            ob.fn();
        });
    });

    ///////////////////////////////////////////////////
    // following tests assume meld library will work //
    ///////////////////////////////////////////////////
    describe('around', function () {
        it('should use the meld library for around advice', function(){
            var originalFunction = function(){},
                aroundFunction = function(){};
            sinon.stub(app.aop._super, 'around');
            app.aop.around(originalFunction, aroundFunction);
            app.aop._super.around.should.have.been.calledWith(
                originalFunction, aroundFunction
            )
            app.aop._super.around.restore();
        });
    });

    describe('returning', function () {
        it('should use the meld library for returning advice', function(){
            var originalFunction = function(){},
                returningFunction = function(){};
            sinon.stub(app.aop._super, 'afterReturning');
            app.aop.returning(originalFunction, returningFunction);
            app.aop._super.afterReturning.should.have.been.calledWith(
                originalFunction, returningFunction
            )
            app.aop._super.afterReturning.restore();
        });
    });

    describe('throwing', function () {
        it('should use the meld library for throwing advice', function(){
            var originalFunction = function(){},
                throwingFunction = function(){};
            sinon.stub(app.aop._super, 'afterThrowing');
            app.aop.throwing(originalFunction, throwingFunction);
            app.aop._super.afterThrowing.should.have.been.calledWith(
                originalFunction, throwingFunction
            )
            app.aop._super.afterThrowing.restore();
        });
    });
});