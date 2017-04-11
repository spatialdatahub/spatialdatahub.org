describe('Tests for the functions in indexMap.js', function() {
  describe('getGeoJSON', function() {

      // expected geojson
      var geojson = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"marker-color":"#7e7e7e","marker-size":"medium","marker-symbol":"","island":"oahu","largest-city":"honolulu"},"geometry":{"type":"Point","coordinates":[-157.950439453125,21.468405577312012]}}]}'


    describe('is a promise that takes a GEOJSON url and returns a leaflet geojson layer', function() {
      it('should return a leaflet geojson layer that can be converted to geojson', function(done){
        // geojson url
        const jsonUrl = 'https://raw.githubusercontent.com/patcurry/GeoJsonData/master/singlepoint.json'

        // apparently it isn't good to call done twice; will it work with an error?
        getGeoJSON(jsonUrl).then(result => {
          expect(JSON.stringify(result.toGeoJSON())).to.equal(geojson)
          done()
        }).catch(done)
      })

      it('should return error saying "Url problem..." on url problem', function(done) {
        const brokenUrl = 'raw.githubusercontent.com/patcurry/GeoJsonData/master/singlepoint.json'

        // apparently it isn't good to call done twice; will it work with an error?
        getGeoJSON(brokenUrl).then(result => {
          console.log(result)
        }, err => {
          expect(err).to.equal(Error('Url problem...'))
          done()
        })
      })
    })
  })

  describe('getKML', function() {
    describe('is a promise that takes a KML url and returns a leaflet geojson layer', function() {
      it('should return a leaflet geojson layer that can be converted to geojson', function(done){
      })

      it('should return error saying "Url problem..." on url problem', function(done) {
      })
    })
  })

  describe('getCSV', function() {
    describe('is a promise that takes a CSV url and returns a leaflet geojson layer', function() {
      it('should return a leaflet geojson layer that can be converted to geojson', function(done){
      })

      it('should return error saying "Url problem..." on url problem', function(done) {
      })
    })
  })

})
