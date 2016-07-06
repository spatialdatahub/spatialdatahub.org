// maybe I should just be running stuff with selenium


console.log('tests.js');
//var assert = require('chai').assert;
//var expect = require('chai').expect;
var assert = chai.assert;
var expect = chai.expect;

//if (typeof require == 'function') }
//  L = require('../../node_modules/leaflet/dist/leaflet-src');
//}

// dummy test
describe('compute', function() {
    it('should return 2 and be ok', function(done) {
        assert.equal(2, L.TestApp.compute());
        done();
    });
});


// check that portal_map.js is there
describe('initMap', function() {
    it('Map Initiation', function(done) {
        assert.is.not.undefined(myMap.almostOver);
        assert.isTrue(myMap.almostOver.enabled());
        done();
    });
});

// check that map loads to div with id 'mapid'
expectedLatLng = {lat: 0, lng: 8.846};
describe('check default latitude and longitude', function() {
    it('setView', function(done) {
        assert.equal(myMap.getCenter(), expectedLatLng);
        done();
    });
});

describe('I hate this testing framework', function() {
    it('should do what i tell it to', function(done) {
        myMap.getCenter()  
    });
});
// check that map loads to latitude 0, and longitutde 8.8460 with zoom set to 2
console.log(myMap);

// check that base layer is the OpenStreetMap Mapnik layer

// check that correct map attribution is there

// check that the correct layers from leaflet-providers are available 

// load dummy geoJSON layer from open url

// load dummy geoJSON layer from local source (simulating layer from password
// protected url)

// load dummy KML layer from open url

// load dummy KML layer from local source 

// check for popup with latitude and longitude on map click

// check that dummy data layers can be cleared without clearing the map
// background
