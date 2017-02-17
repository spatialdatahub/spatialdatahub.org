var assert = require('chai').assert
var expect = require('chai').expect
var chaiAsPromised = require("chai-as-promised")
var index = require('./../static/js/index')
//var getData = require("xmlhttprequest").getData
// var jsdom = require('jsdom')


// jsdom.env(
//   '<html><body><div></div></body></html>',
//   [index],
//   function (err, window) {
//     console.log("did it work?", index)
//   }
// )

describe('smoke test', function() {
  it('should be able to bring in a dummy function', function() {
    assert.equal(index.addSmoke(1,2), 3)
  })
})




describe('Test getData function', function() {

  const testData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "marker-color": "#7e7e7e",
          "marker-size": "medium",
          "marker-symbol": "",
          "island": "oahu",
          "largest-city": "honolulu"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -157.950439453125,
            21.468405577312012
          ]
        }
      }
    ]
  }

  const testContainer = []

  const testUrl = 'https://raw.githubusercontent.com/zmtdummy/' +
    'GeoJsonData/master/singlepoint.json'

  it('smoke test', function() {
    assert.equal(testUrl, 'https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/singlepoint.json')
  })
  it('should die!',function() {
    return assert.eventually.equal(
      index.getData(testUrl)
      .then(data => testContainer.push(data), error => error), [testData])
  })
})
