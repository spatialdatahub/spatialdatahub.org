//const L = require('leaflet')
//const omnivore = require('@mapbox/leaflet-omnivore')
const addSmoke = require('../pieces/mapFunctions.js').addSmoke
const extSelect = require('../pieces/mapFunctions.js').extSelect

describe('mapFunctions', function () {

  describe('mapFunctions addSmoke test', function () {
    it('should add numbers', function () {
      assert.equal(addSmoke(1,3), 4)
    })
  })


// this is impossible! maybe I need to rewrite my functions so they fit with the
// tests, but that seems like bad practice
  describe('extSelect', function () {

    it('should return the getCSV function if it is given the csv ext argument', function () {
      
      //var spyGetCSV = sinon.spy(extSelect, 'getCSV')
      var stubGetCSV = sinon.stub('getCSV')
      extSelect('csv', 'whatever')

      //spyGetCSV.restore()
      sinon.assert.called(stubGetCSV)
    })
    
  })


})

