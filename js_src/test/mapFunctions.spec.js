const mapFunctions = require('../pieces/mapFunctions.js')

describe('mapFunctions', function () {

  describe('latLngPointOnFeature', function () {

    const poly = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -18.544921875,
                  29.53522956294847
                ],
                [
                  -8.9208984375,
                  22.30942584120019
                ],
                [
                  -9.31640625,
                  31.39115752282472
                ],
                [
                  -18.544921875,
                  29.53522956294847
                ]
              ]
            ]
          }
        }
      ]
    }

    const line = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [
                -13.9306640625,
                33.87041555094183
              ],
              [
                2.4609375,
                27.72243591897343
              ]
            ]
          }
        }
      ]
    }

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

      it('should return <dt>Latitude:</dt> <dd>38</dd> for point feature latitude coordinate', function (){
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

      it('should return <dt>Longitude:</dt> <dd>-4</dd> for point feature longitude coordinate', function (){
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
      it('should return \'\' for line feature', function () {
        const expected = ''
        const lineLayer = L.geoJson(line, {
          onEachFeature: (feature, layer) => {
            assert.equal(
              mapFunctions.latLngPointOnFeature(feature),
              expected
            )
          }
        })
      })

      /* test with polygon */
      it('should return \'\' for polygon feature', function () {
        const expected = ''
        const polygonLayer = L.geoJson(poly, {
          onEachFeature: (feature, layer) => {
            assert.equal(
              mapFunctions.latLngPointOnFeature(feature),
              expected
            )
          }
        })
      })
    })    
  })


  describe('checkFeatureProperties', function () {
    describe('should return array of feature properties of a layer (geojson dataset)', function () {

      const point = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "color": "blue"
            },
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

      const line = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  -13.9306640625,
                  33.87041555094183
                ],
                [
                  2.4609375,
                  27.72243591897343
                ]
              ]
            }
          }
        ]
      }

      // something is wrong here, the expected is the same as the returned value,
      // but the test is not recognizing it as so.
      // figured it out, to compare objects use 'deepEqual'
      it('should return [ \'<dt>color</dt> <dd>blue</dd>\' ]', function () {
        const expected = ['<dt>color</dt> <dd>blue</dd>'] 
        const pointLayer = L.geoJson(point, {
          onEachFeature: (feature, layer) => {
            assert.deepEqual(
              mapFunctions.checkFeatureProperties(feature),
              expected
            )
          }
        })
      })

      it('layer without properties should return [ \'No feature properties\' ]', function () {
        const expected = [] 
        const lineLayer = L.geoJson(line, {
          onEachFeature: (feature, layer) => {
            assert.deepEqual(
              mapFunctions.checkFeatureProperties(feature),
              expected
            )
          }
        })
      })
      
    })
  })

// END //
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
