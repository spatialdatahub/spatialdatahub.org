// test.js
// The first of many javascript testing files that use mocha and chai.
// Because leaflet needs a window to work from we will simulate one.

GLOBAL.window = {};
GLOBAL.document = {
    documentElement: {
        style: {}
    }, 
    getElementsByTagName: function() { return []; },
    getElementsById: function() { return []; },
    createElement: function() { return {}; }
};
GLOBAL.navigator = {
    userAgent: 'nodejs'
};
GLOBAL.L = require('leaflet');

var chai = require('chai')
var expect = require('chai').expect;
var assert = chai.assert;

L.MochaTest = require('./datasets/js/mocha_test').MochaTest;
L.map = require('./datasets/js/mocha_test').map;

describe('MochaTest', function() {
  it('should exist', function() {
    var MochaTest= require('./datasets/js/mocha_test');
    expect(MochaTest).to.not.be.undefined;
  });
});

// describe('myMap', 

/*
if (typeof require == 'function') {
    var assert = require('assert'),
    L = require('leaflet/dist/leaflet-src');
    L.MochaTest = require('./datasets/js/mocha_test').MochaTest;
}
*/
/*
// Test function call
describe('compute', function() {
    it('should be there', function(done) {
        assert.equal(2, L.MochaTest.compute());
        done();
    });
});
*/

describe('MochaTest', function() {
  it('should exist', function() {
    var MochaTest= require('./datasets/js/mocha_test');
    expect(MochaTest).to.not.be.undefined;
  });
});

/* 
describe('map', function() {
    it('should be there', function() {
        var map = require('./datasets/js/mocha_test');
        expect(map).to.not.be.undefined;
    });
});
*/
