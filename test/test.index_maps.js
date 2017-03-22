const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const jsdom = require('jsdom')

chai.use(chaiAsPromised)

//////// THIS SHOULD BE SET UP FOR ALL THE TEST FILES ////////
// setup the simplest document possible
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')

// get the window object out of the document
const win = doc.defaultView

// set globals for mocha that make access to document and window feel 
// natural in the test environment
global.document = doc
global.window = win

// take all properties of the window object and also attach it to the 
// mocha global object
propagateToGlobal(win)

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}
//////// THIS SHOULD BE SET UP FOR ALL THE TEST FILES ////////

// I shouldn't have to make so many global variables

const leaflet = require('leaflet')
const omn = require('@mapbox/leaflet-omnivore')

global.L = leaflet
global.omnivore = omn

const index_maps = require('../static/js/index_maps.js')

describe('Test index_maps.js', function() {

  describe('Test getGeoJSON', function() {
    const getGeoJSON = index_maps.getGeoJSON

    it('should return a promise that runs omnivore.geojson', function() {
      let url = 'www.whatever.json'
      let promise = getGeoJSON(url)      
      return expect(promise).to.eventually.equal()
    }) 
  })

  describe('Test extSelect', function() {
    const extSelect = index_maps.extSelect

    it('should call getGeoJSON when url extension ends with json', function() {

      const getGeoJSON = sinon.spy()
      const url = 'www.whatever.json'
      const ext = 'json'
      assert.equal(
        index_maps.extSelect(ext, url),
        index_maps.getGeoJSON(url)
      )
    })

    it('should call correct getData function based on url extension', function() {
    })


  })



})

