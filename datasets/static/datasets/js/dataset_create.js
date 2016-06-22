var map;
var zmtBremen = {lat: 53.1078, lng: 8.8460};

// initialize map, centered on the ZMT in Bremen
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: {lat: 0, lng: 8.8460},
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
}

// add json data to map from url without password protection
function showJsonData(jsonDataset) {
  map.data.loadGeoJson(jsonDataset);
}

// add json data to map from url with password protection
function showProtectedJsonData(jsonDataset) {
  map.data.addGeoJson(jsonDataset);
}

// Hide GeoJSON data overlay from map on button click
function clearData() {
  map.data.forEach(function(feature) {
    map.data.remove(feature);
  });
}

// Dummy function
function addNumbers(a,b) {
  return a + b;
};
