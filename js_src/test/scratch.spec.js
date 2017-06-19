const scratch = require('../new/scratch.js');
const assert = chai.assert

const myMap = scratch.myMap
const once = scratch.once

describe('Leaflet', () => {
  describe('Options', () => {
    it('should have a center point', () => {
      assert.equal(myMap.getCenter().lat, 38)
    })
  })

})

describe('Sinon examples', function () {
  describe('mapFunctions sinon basic example function', function () {
    it('calls the original function', function () {
      const callback = sinon.spy()
      const proxy = once(callback)

      proxy()

      assert(callback.called)
    })

    it('calls the original function only once', function () {
      const callback = sinon.spy()
      const proxy = once(callback)

      proxy()
      proxy()

      assert(callback.calledOnce)
      // assert.equal(callback.callCount, 1)
    })

    
    it("returns the return value from the original function", function () {
      const callback = sinon.stub().returns(42)
      const proxy = once(callback)

      assert.equal(proxy(), 42)
    })
    

  })
})

