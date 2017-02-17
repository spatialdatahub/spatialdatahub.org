var assert = require('chai').assert

var index = require('./../index.js')
// var jsdom = require('jsdom')
//var fs = require('fs')
//var index = fs.readFileSync('../index.js', 'utf-8')

// console.log(index)

//
// jsdom.env(
//   '<html><body><div></div></body></html>',
//   [index],
//   function (err, window) {
//     console.log("did it work?", index)
//   }
// )
//
//

// const addSmoke = (a, b) => a + b

describe('smoke test', function() {
  it('should be able to bring in a dummy function', function() {
    assert.equal(index.addSmoke(1,2), 3)
  })
})
