const assert = require('chai').assert
const jsdom = require('jsdom')

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


const leaflet = require('leaflet')
const omnivore = require('@mapbox/leaflet-omnivore')


// import index_maps.js the import is relative to the file, not the environment
// node is run in the WebGIS dir, the test file is in WebGIS/test dir
// the path from WebGIS is static/js/index_maps.js, and the path from WebGIS/test
// is ../static/js/index_maps.js
const index_maps = require('../static/js/index_maps.js')

describe('Test index_maps.js', function() {

  describe('Test addDataToContainer', function() {
    // bring in the function, and make it easy to call
    const = index_maps.addDataToContainer

    // make object
    const container = {}

    // make data
    const text = 'text'

    it('should add data to object[key]', function() {
      addDataToContainer(text, container, 'key')
      assert.equal(container['key'], 'text')
    })
  })



})

