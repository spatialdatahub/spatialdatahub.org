// Use require only if available (ran from Node)
var assert = require('chai').assert;

// Some other stuff
if (typeof require == 'function') {
  var assert = require('assert'),
  L = require('leaflet/src/Leaflet');
  L.myMap = require('../../datasets/static/datasets/js/portal_map_leaflet.js').myMap;
}

// So how do I get the map in here?

