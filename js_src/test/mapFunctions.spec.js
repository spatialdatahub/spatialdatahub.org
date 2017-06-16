//const L = require('leaflet')
//const omnivore = require('@mapbox/leaflet-omnivore')
const addSmoke = require('../pieces/mapFunctions.js').addSmoke
//const once = require('../pieces/mapFunctions.js').once
const getCSV = require('../pieces/mapFunctions.js').getCSV
const extSelect = require('../pieces/mapFunctions.js').extSelect

describe('mapFunctions', function () {

  describe('mapFunctions addSmoke test', function () {
    it('should add numbers', function () {
      assert.equal(addSmoke(1,3), 4)
    })
  })



//  describe('extSelect', function () {

//    it('should return the getCSV function if it is given the csv ext argument', function () {
//      console.log(extSelect)
      
//      var getCSV = sinon.spy()
//      extSelect('csv', 'whatever')
//      sinon.assert.called(getCSV)
//    })
    
//  })


})

