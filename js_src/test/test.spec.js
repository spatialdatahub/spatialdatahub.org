const scratch = require('../new/scratch.js');

const myMap = scratch.myMap

describe('Leaflet', () => {
  describe('Options', () => {
    it('should have a center point', () => {
      assert.equal(myMap.getCenter().lat, 38)
    })
  })
})
