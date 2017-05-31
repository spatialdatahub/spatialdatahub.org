'use strict';

// nominatim stuff

// (1) hide and show nominatim stuff (do this after I've gotten it working)
var findPlaceButton = document.getElementById('find_place_button');
var findPlaceContainer = document.getElementById('find_place_container');

findPlaceButton.addEventListener('click', function showPlaceContainer() {
  classToggle(findPlaceButton, 'active');

  findPlaceContainer.style.display === 'none' || findPlaceContainer.style.display === '' ? findPlaceContainer.style.display = 'block' : findPlaceContainer.style.display = 'none';
});

// (2) get elements
var placeInput = document.getElementById('place_input');
var placeButton = document.getElementById('place_button');
var placeToggle = document.getElementById('place_toggle');
var selector = document.getElementById('selector');
var selectButton = document.getElementById('select_button');
var possiblePlaceLayers = {}; // this is where i keep the layers to query the map with
var selectedPlace = [];
var saidPolygon = [];

//activeDatasetButtons.push(placeButton, placeToggle, selectButton)

function makeSelectorOptions(array) {
  selector.innerHTML = '';
  array.forEach(function (place) {
    var option = document.createElement('option');
    option.value = place.display_name;
    var text = document.createTextNode(place.display_name);
    option.appendChild(text);
    selector.appendChild(option);

    var lyr = L.geoJson(place.geojson);
    possiblePlaceLayers[place.display_name] = lyr;
  });
}

// add place(s) to the selector
placeButton.addEventListener('click', function findPlace() {
  var val = placeInput.value;
  en.getPlaceData(val, makeSelectorOptions);
});

// select place to display
selectButton.addEventListener('click', function selectPlace() {
  Object.values(possiblePlaceLayers).forEach(function (n) {
    myMap.removeLayer(n);
  });

  selectedPlace.length !== 0 ? (selectedPlace.pop(), selectedPlace.push(possiblePlaceLayers[selector.value])) : selectedPlace.push(possiblePlaceLayers[selector.value]);
  console.log(possiblePlaceLayers);

  var selectedPlaceType = selectedPlace[0].toGeoJSON().features[0].geometry.type;
  if (selectedPlaceType === 'Polygon' || selectedPlaceType === 'MultiPolygon') {
    var p = selectedPlace[0];
    saidPolygon.push(p);
  }

  var lyr = selectedPlace[0];
  lyr.addTo(myMap);
  myMap.fitBounds(lyr.getBounds());
});

// map and layer should be arguements for a predefined function
placeToggle.addEventListener('click', function () {
  myMap.hasLayer(selectedPlace[0]) ? myMap.removeLayer(selectedPlace[0]) : myMap.addLayer(selectedPlace[0]);
});