// test.js
// The first of many javascript testing files that use mocha and chai.

if (typeof require == 'function') {
    var assert = require('assert'),
    L = require('leaflet/dist/leaflet-src');
    L.MochaTest = require('./datasets/js/mocha_test.j').MochaTest;
}

// Test function call
describe('compute', function() {
    it('should be there', function(done) {
        assert.equal(2, L.MochaTest.compute());
        done();
    });
});
