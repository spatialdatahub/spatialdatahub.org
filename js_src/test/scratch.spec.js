const scratch = require('../new/scratch.js');
const assert = chai.assert

/*
const myMap = scratch.myMap
const once = scratch.once

const funcA = scratch.funcA
const funcB = scratch.funcB
*/

describe('Leaflet', () => {
  describe('Options', () => {
    it('should have a center point', () => {
      assert.equal(scratch.myMap.getCenter().lat, 38)
    })
  })

})

describe('Sinon examples', function () {
  describe('mapFunctions sinon basic example function', function () {
    it('calls the original function', function () {
      const callback = sinon.spy()
      const proxy = scratch.once(callback)

      proxy()

      assert(callback.called)
    })

    it('calls the original function only once', function () {
      const callback = sinon.spy()
      const proxy = scratch.once(callback)

      proxy()
      proxy()

      assert(callback.calledOnce)
      // assert.equal(callback.callCount, 1)
    })

    
    it("returns the return value from the original function", function () {
      const callback = sinon.stub().returns(42)
      const proxy = scratch.once(callback)

      assert.equal(proxy(), 42)
    })
    

  })
})


describe('My Own Sinon Tests', function () {
  describe('testing a function that takes and returns a callback', function () {

    describe('spying on funcA', function () {
      it('should take a sinon spy as a call back and return something useful', function () {
        const callbackSpy = sinon.spy()
        const proxy = scratch.funcA(callbackSpy)

        proxy()
        assert(callbackSpy.calledOnce)
      })
    })

    describe('stubbing funcA', function () {
      it('should take a sinon stub as a call back and return something...', function () {
        const callbackStub = sinon.stub().returns('yeah')
        const proxy = scratch.funcA(callbackStub)

        assert.equal(proxy(), 'yeah')
      })
    })
  })

  // how do I run this through the export table
  // the javascript has no way of accessing the funcA throu funcB because it's basically
  // a secret function in the scratch.js thing? or something.
  describe('function that does not take arguments but returns another function', function() {
    describe('spying on funcB', function () {
      var funcASpy;

      beforeEach(function () {
        funcASpy = sinon.spy(scratch, 'funcA')
      });

      afterEach(function () {
        scratch.funcA.restore();
      })

      it('should tell me that funcA is being returned, but how?', function () {
        scratch.funcB();
        sinon.assert.called(funcASpy) 
        // callbackSpy.should.have.been.called
        // assert.called(callbackSpy)
      })
    })

    describe('stubbing funcB', function () {

      var funcAStub;

      beforeEach(function () {
        funcAStub = sinon.stub(scratch, 'funcA');
      });

      afterEach(function () {
        scratch.funcA.restore();
      });

      it('should tell me that the funcA stub is being called', function () {
        scratch.funcB();
        sinon.assert.called(funcAStub)
      })
    })
  })
})



/* Here is a stack overflow example of what I am trying to do
// https://stackoverflow.com/questions/23028141/unexpected-assertion-error-of-sinon

//myModule.js
var _f2 = function() {
    console.log('_f2 enter');
    return {prop1:'var1'};
};

var f1 = function(){  
    var  myVar1  = _f2();
    console.log('_f2 called'); 
 };

module.exports._f2  = _f2;
module.exports.f1  = f1; 

//tests.js
var sinon = require('sinon');
var myModule = require('./myModule');

describe('test my module',function(){
    var f2Spy ;
    beforeEach(function(){
        f2Spy = sinon.spy(myModule,'_f2');
    });
    afterEach(function(){
        myModule._f2.restore();

    });
    it('call _f2',function(done){
        myModule.f1();  
        sinon.assert.called(f2Spy);

        done();
    })
});

// error
AssertError: expected _f2 to have been called at least once but was never called

// ANSWER
If you modify your module this way, then the test will pass:

var f1 = function(){
    var  myVar1  = exports._f2();
    console.log('_f2 called');
};
(By the way, using exports in my code above is equivalent to using module.exports given the code you've shown.)

The problem with your original code is that there is no way for other regular JavaScript code to intercept direct calls to _f2 that are made inside your module. Sinon is regular JavaScript code, so it cannot intercept direct calls to _f2. If you make your call through the exports table, then there is an opportunity for Sinon to patch this table to intercept the call  .

*/

// the above didn't work for me
/*
// this doesn't work
const funcA = callback => callback 

const funcB = () => exports.funcA()

*/
