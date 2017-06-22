const mapFunctions = require('../pieces/mapFunctions.js')

describe('mapFunctions', function () {

  describe('latLngPointOnFeature', function () {

    // gotta do some hacky stuff here
    const point = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              -4,
              38
            ]
          }
        }
      ]
    }

    describe('should return html with the lat and lng coordinates', function () {

      it('should return <dt>Latitude:</dt> <dd>38</dd> for the latitude coordinate', function (){
        const expected = '<dt>Latitude:</dt> <dd>38</dd>'
        const pointLayer = L.geoJson(point, {
          onEachFeature: (feature, layer) => {
            assert.equal(
              mapFunctions.latLngPointOnFeature(feature)[0],
              expected
            )
          }
        })
      })

      it('should return <dt>Longitude:</dt> <dd>-4</dd> for the latitude coordinate', function (){
        const expected = '<dt>Longitude:</dt> <dd>-4</dd>'
        const pointLayer = L.geoJson(point, {
          onEachFeature: (feature, layer) => {
            assert.equal(
              mapFunctions.latLngPointOnFeature(feature)[1],
              expected
            )
          }
        })
      })

      /* test with line */
      /* test with polygon */

    })    
  })

})



/*
const L = require('leaflet')
const omnivore = require('@mapbox/leaflet-omnivore')
const mapFunctions = require('../pieces/mapFunctions.js')

describe('mapFunctions', function () {

// this is impossible! maybe I need to rewrite my functions so they fit with the
// tests, but that seems like bad practice
//  describe('extSelect', function () {
//    describe('when given "CSV" as the extension', function () {
    //  beforeEach(function () {
    //    var spyGetCSV = sinon.spy(mapFunctions, 'getCSV')
    //  })

    //  afterEach(function () {
    //    mapFunctions.getCSV.restore()
    //  })
 
      it('whatever, i need to learn to spy', function () {

        //var spyGetCSV = sinon.spy(mapFunctions, 'getCSV')
        var stubGetCSV = sinon.stub(mapFunctions, 'getCSV')
        mapFunctions.extSelect('csv','https://raw.githubusercontent.com/patcurry/GeoJsonData/master/airports.csv')


        mapFunctions.getCSV.restore()
        sinon.assert.calledOnce(mapFunctions.getCSV)
      })
    })
*/
  /*
    describe('when given "geojson" as the extension', function () {
      beforeEach(function () {
        var spyGetGeoJSON = sinon.spy(mapFunctions, 'getGeoJSON')
      })

      afterEach(function () {
        mapFunctions.getGeoJSON.restore()
      })

      it('whatever, i need to learn to spy', function () {

        mapFunctions.extSelect('geojson','https://raw.githubusercontent.com/patcurry/GeoJsonData/master/ZMTPublications0929.geojson')
        sinon.assert.calledOnce(mapFunctions.getGeoJSON)
      })
    })
    
  })
})


    
    it('should be called once if called', function () {
      var spyGetCSV = sinon.spy(mapFunctions, 'extSelect')
      mapFunctions.extSelect('csv', 'https://raw.githubusercontent.com/patcurry/GeoJsonData/master/airports.csv')
//      var spyGetCSV = sinon.spy()
//      mapFunctions.extSelect('csv', 'https://raw.githubusercontent.com/patcurry/GeoJsonData/master/airports.csv', spyGetCSV)


      spyGetCSV.restore()
      sinon.assert.calledOnce(spyGetCSV)
      //assert(spyGetCSV.called)
    })



    it('should return the getCSV function if it is given the csv ext arguement', function () {
      var stubGetCSV = sinon.stub(mapFunctions, 'getCSV')
      var proxy = mapFunctions.extSelect('csv', 'https://raw.githubusercontent.com/patcurry/GeoJsonData/master/airports.csv')

      stubGetCSV.restore()
      sinon.assert.called(proxy, stubGetCSV)
    })
  */  
