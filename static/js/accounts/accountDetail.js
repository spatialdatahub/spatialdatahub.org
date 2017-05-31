'use strict';

// ////////////////////////////////////////////////////////////////////////////
/*
// ACCOUNT DETAIL SPECIFIC FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////
// Before dataset list load

// colors
var colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];
var colorCounter = 0;

// pointMarkerOptions
var markerOptions = {
  radius: 6,
  color: 'black',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
};

// stuff
var breadcrumbContainer = document.getElementById('selected_link');

// After dataset list load
var datasetLinks = document.getElementsByName('dataset');
var datasets = {};

// this should be in the breadcrumbs
// const accountSlug = document.getElementById('account_link') // .getAttribute('value')
// console.log(accountSlug)

// add event that toggles the link's class from active to not active
datasetLinks.forEach(function handleLink(link) {
  var ext = link.getAttribute('id');
  var pk = link.getAttribute('value');

  // this should be done better
  var url = void 0;
  link.getAttribute('url') ? url = link.getAttribute('url') : url = '/load_dataset/' + pk;

  // this is getting out of hand
  // const dsAjax = `${accountSlug}/dataset_ajax/${pk}`
  // const dsAjax = `dataset_ajax/${pk}`

  // deal with colors
  colorCounter++;
  var color = colors[colorCounter % colors.length];

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

  var linkParent = link.parentElement;

  // one more thing I have to do is append the dataset to the bread crumbs on click
  // sorta hacky... this should be written better
  var dsText = link.textContent;
  var dsLink = link.getAttribute('link');
  var breadcrumb = '<h4><a href="' + dsLink + '">Go to the ' + dsText + ' detail page</a></h4>';

  link.addEventListener('click', function () {
    classToggle(linkParent, 'active');

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

    // append breadcrumbs links to breadcrumbs thing on click
    breadcrumbContainer.innerHTML = breadcrumb;
  });
});