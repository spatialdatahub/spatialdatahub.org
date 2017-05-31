'use strict';

// ////////////////////////////////////////////////////////////////////////////
/*
// URLTEST SPECIFIC FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////

// get input text element and submit button
var urlInput = document.getElementById('url_input');
var urlButton = document.getElementById('url_button');
var toggleAllButton = document.getElementById('toggle_all');
var buttons = document.getElementById('buttons');
var colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];

// nominatim stuff
var placeInput = document.getElementById('place_input');
var placeButton = document.getElementById('place_button');
var placeToggle = document.getElementById('place_toggle');
var selector = document.getElementById('selector');
var selectButton = document.getElementById('select_button');
// const possiblePlaces = {}
// const possiblePlaces = en.possiblePlaces
var possiblePlaceLayers = {}; // this is where i keep the layers to query the map with
var selectedPlace = [];

// filter button
var filterButton = document.getElementById('filter_button');

// make selector options
// hardcoding this
//const makeSelectorOptions = (array, selector) => {
var makeSelectorOptions = function makeSelectorOptions(array) {
  // clear selector options
  selector.innerHTML = '';

  array.forEach(function (p) {
    var obj = {};
    obj.display_name = p.display_name;
    obj.geojson = p.geojson;

    var display_name = obj.display_name;

    var option = document.createElement('option');
    option.value = obj.display_name;
    var text = document.createTextNode(obj.display_name);
    option.appendChild(text);
    selector.appendChild(option);

    var lyr = L.geoJson(obj.geojson);
    possiblePlaceLayers[display_name] = lyr;
  });
};

placeButton.addEventListener('click', function getPlaces() {
  var val = placeInput.value;
  var data = en.getPlaceData(val, makeSelectorOptions);
});

// tightly coupled with the selector options thing
// i can't just keep geojson in the possiblePlaces object, it must be layers, that way
// i can use the 'map.hasLayer()' function

selectButton.addEventListener('click', function selectPlace() {

  Object.values(possiblePlaceLayers).forEach(function (n) {
    myMap.removeLayer(n);
  });

  selectedPlace.length !== 0 ? (selectedPlace.pop(), selectedPlace.push(possiblePlaceLayers[selector.value])) : selectedPlace.push(possiblePlaceLayers[selector.value]);

  var lyr = selectedPlace[0];
  lyr.addTo(myMap);
  myMap.fitBounds(lyr.getBounds());
});

// test url js

// make container for the datasets
var datasets = {};
var count = 0;

// pointMarkerOptions
var markerOptions = {
  radius: 6,
  color: 'black',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
};

// add event listener to the button
urlButton.addEventListener('click', function getDataFromUrl() {
  var ext = getExt(urlInput.value);
  var url = urlInput.value;

  // increment count and color
  count++;
  var color = colors[count % colors.length];

  // should these things be in the extSelect call?
  // get dataset, save it to datasets container, and add it to map
  extSelect(ext, url).then(function (response) {
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

    // if response is good, add a button for it
    // Ugh, I'm using the 'this' keyword. Not cool.
    addButton(count, color, buttons).addEventListener('click', function () {
      classToggle(this, 'active');
      var val = this.getAttribute('value');
      myMap.hasLayer(datasets[val]) ? myMap.removeLayer(datasets[val]) : myMap.addLayer(datasets[val]);
    });

    // modify data here
    layerMod.addData(response.toGeoJSON());

    datasets[count] = layerMod;
    myMap.addLayer(layerMod).fitBounds(layerMod.getBounds());
  }, function (error) {
    return console.log(error);
  });
});

// this needs to be added to indexMap.js, and tested
// this also needs to turn the other buttons from active to inactive and vise versa
var toggleAll = function toggleAll(obj, map) {
  // make array
  var array = [];

  // push values to array
  Object.values(obj).forEach(function (val) {
    return array.push(val);
  });

  // check if map has any of the layers
  // if true, remove layers
  // if false, add all layers
  var tf = [];
  array.forEach(function (ds) {
    map.hasLayer(ds) ? tf[0] = true : console.log('nope');
  });

  // if tf is true, remove all layers, otherwise add them all
  tf[0] === true ? array.forEach(function (ds) {
    return map.removeLayer(ds);
  }) : array.forEach(function (ds) {
    return map.addLayer(ds);
  });
};

toggleAllButton.addEventListener('click', function () {
  toggleAll(datasets, myMap);
});

/*
What I need to do is write a bunch of stuff for turf

First, I need to save the test url data that are on the map in an obvious easy to access place,
then I need to convert them to geojson using the leaflet function '.ToGeoJSON()'. Then the same
thing needs to happen for the place polygon. Once that happens, I can use
'turf.within(points, polygon)' to get the points within the place polygon. Then I have to add
those data to a layer, and then add the layer to the map. There should also be a button that
toggles the points on and off, for the test url, place, and points within.

Once I've done this with a polygon and points I need to do a polygon intersect type thing for
polygon to polygon stuff.

Also, the nominatim stuff should be saved as an npm package that I can bring in to whatever
page I want. That will be for after I show the functionality off at the next meeting.
*/

// make container for saved file data
var fileContainer = [];

// map and datasets should be arguements for a predefined function
filterButton.addEventListener('click', function () {
  var pointsDatasets = [];
  Object.values(datasets).forEach(function (ds) {
    myMap.hasLayer(ds) ? pointsDatasets.push(ds) : console.log('no');
  });
  var poly = selectedPlace[0].toGeoJSON();
  pointsDatasets.forEach(function (ds) {
    var jds = ds.toGeoJSON();
    var fds = turf.within(jds, poly);
    L.geoJSON(fds).addTo(myMap);

    // this only lets one dataset be in the file container at a time.
    // what should be here is a way to avoid duplicatio
    // or a way to just get all the active datasets on the map, and add
    // them to the file container
    if (fileContainer.length !== 0) {
      fileContainer.pop();
      fileContainer.push(fds);
    } else {
      fileContainer.push(fds);
    }
    console.log(fileContainer);
  });
});

// map and layer should be arguements for a predefined function
placeToggle.addEventListener('click', function () {
  myMap.hasLayer(selectedPlace[0]) ? myMap.removeLayer(selectedPlace[0]) : myMap.addLayer(selectedPlace[0]);
});

// Get the combined dataset, make into geojson instead of a layer, then create a new Blob
// and save the geojson to the blob.
var saveComboButton = document.getElementById('save_combo_button');

saveComboButton.addEventListener('click', function saveCombo() {
  var filename = 'yeah';
  var data = JSON.stringify(fileContainer[0]);
  console.log(data);
  //  const blob = new Blob([data], {type: "text/plain; charset=utf-8"})
  //  saveAs(blob, filename + ".geojson")
});