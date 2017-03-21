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

// import index.js the import is relative to the file, not the environment
// node is run in the WebGIS dir, the test file is in WebGIS/test dir
// the path from WebGIS is static/js/index.js, and the path from WebGIS/test
// is ../static/js/index.js
const index = require('../static/js/index.js')

describe('Test index.js', function() {
  describe('Test addDataToContainer (is this function necessary?)', function() {
    // bring in the function, and make it easy to call
    const addDataToContainer = index.addDataToContainer

    // make object
    const container = {}

    // make data
    const text = 'text'

    it('should add data to object[key]', function() {
      addDataToContainer(text, container, 'key')
      assert.equal(container['key'], 'text')
    })
  })

  describe('Test classToggle function', function() {
    // bring in the function, and make it easy to call
    const classToggle = index.classToggle

    // make a div with an empty class
    const div = document.createElement('div')  
    div.className = '' 

    it('should add the class "super"', function() {
      classToggle(div, 'super')
      assert.equal(div.className, 'super')
    })

    it('should remove the class "super"', function() {
      classToggle(div, 'super')
      assert.equal(div.className, '')
    })
  })

  describe('Test classToggleOnDiffLink', function() {
    // bring in the function, and make it easy to call
    const classToggleOnDiffLink = index.classToggleOnDiffLink

    // make a div with an empty class
    const div1 = document.createElement('div')  
    const div2 = document.createElement('div')  
    div1.className = '' 
    div2.className = '' 

    const classes = [div1, div2]

    it('should add the class "super" to div1', function() {
      classToggleOnDiffLink(div1, classes, 'super')
      assert(div1.className.includes('super'), 'assert the className includes "super"')
      assert.equal(div2.className, '')
    })

    it('should remove the class "super" from div1 and add it to div2', function() {
      classToggleOnDiffLink(div2, classes, 'super')
      assert(div2.className.includes('super'), 'assert the className includes "super"')
      assert.equal(div1.className, '')
    })
  })
})

