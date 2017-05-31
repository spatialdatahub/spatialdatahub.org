'use strict';

// ////////////////////////////////////////////////////////////////////////////
/*
// PAGE SPECIFIC FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////

var dataset = [];
var pk = document.getElementById('dataset_pk').getAttribute('value');
var ext = document.getElementById('dataset_ext').getAttribute('value');

// there must be a better way to do this... but for now it works
// it should be turned into a function and used here and in the portalView
var url = void 0;
document.getElementById('dataset_url').getAttribute('url') ? url = document.getElementById('dataset_url').getAttribute('url') : url = 'load_dataset/' + pk;

var color = 'red'; // I'm going to make a color selector element, and take the value

var featureCountElement = document.getElementById('feature_count');

// pointMarkerOptions
var markerOptions = {
  radius: 6,
  color: color,
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
};

// make a L.geoJSON object that can be used to filter the data
var filteredLayer = L.geoJSON(null, {
  // filter: filterValues, // this should be a function...
  // set the points to little circles
  pointToLayer: function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, markerOptions);
  },
  onEachFeature: function onEachFeature(feature, layer) {
    // make sure the fill is the color
    layer.options.fillColor = color;
    // and make sure the perimiter is black (if it's a point) and the color otherwise
    feature.geometry.type === 'Point' ? layer.options.color = 'black' : layer.options.color = color;
    // add those popups
    addPopups(feature, layer);
  }
});

// get the dataset, add it to the map as a layer, and add the
// geojson to the dataset array
// could I just pass the dataset and object in here, instead
// of in the index.js page?
// or could i just put this on the index page and do it there?

var fc = function fc(obj) {
  featureCountElement.innerHTML = Object.keys(obj._layers).length;
};

// Select correct function with the extension, then get the data
// with a promise. Then add the data to the modified layer as geoJson,
// then add the modified layer to the map and get its bounds
// then call any other functions that should be run when the page is loaded

// It seems that I hvae problems here
extSelect(ext, url).then(function (response) {
  dataset.push(response.toGeoJSON()); // add data to empty dataset array
  filteredLayer.addData(response.toGeoJSON()); // add data to filter layer
  myMap.addLayer(filteredLayer).fitBounds(filteredLayer.getBounds()); // add filter layer to map
  fc(filteredLayer); // get the number of features and add it to the feature count div
}, function (error) {
  return console.log(error);
});