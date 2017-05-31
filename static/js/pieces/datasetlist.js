'use strict';

// colors
var colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];
var linkDatasetColorCounter = 0; // this is for the datasets from the links

// pointMarkerOptions
var markerOptions = {
  radius: 6,
  color: 'black',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
};

var datasetLinksNodeList = document.getElementsByName('dataset');
var datasetLinks = Array.prototype.slice.call(datasetLinksNodeList);
var datasets = {};
var activeDatasetButtons = [];

datasetLinks.forEach(function handleDatasetLink(link) {
  var pk = link.id;
  var ext = link.value;

  // this should be done better
  var url = void 0;
  link.getAttribute('url') ? url = link.getAttribute('url') : url = '/load_dataset/' + pk;

  // deal with colors
  linkDatasetColorCounter++;
  var color = colors[linkDatasetColorCounter % colors.length];

  // Every time I call the 'getDataset' function there needs to be a new modJson called
  // there should probably also be a marker cluster function called
  var layerMod = L.geoJson(null, {
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
      addPopups(feature, layer); // this comes from the index_maps.js file
    }
  });

  function linkEvent(link) {
    classToggle(link, 'active');

    datasets[pk] ? myMap.hasLayer(datasets[pk]) ? myMap.removeLayer(datasets[pk]) : myMap.addLayer(datasets[pk]).fitBounds(datasets[pk].getBounds())
    // if there is no datasets[pk] then go through the process of selecting
    // the right omnivore function and getting the data and stuff
    : extSelect(ext, url) // the promise
    .then(function handleResponse(response) {
      layerMod.addData(response.toGeoJSON()); // modify the layer
      myMap.addLayer(layerMod).fitBounds(layerMod.getBounds());
      addDataToContainer(layerMod, datasets, pk);
    }, function handleError(error) {
      console.log(error);
    });

    activeDatasetButtons.push(link);
  }

  link.addEventListener('click', function () {
    return linkEvent(link);
  });
});