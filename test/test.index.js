const assert = require('chai').assert
const jsdom = require('jsdom')

// Define global.window and global.document.
global.document = jsdom.jsdom();
global.window = global.document.parentWindow;

describe('Test index.js', function() {
  // import index.js the import is relative to the file, not the environment
  // node is run in the WebGIS dir, the test file is in WebGIS/test dir
  // the path from WebGIS is static/js/index.js, and the path from WebGIS/test
  // is ../static/js/index.js
  const index = require('../static/js/index.js')

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




