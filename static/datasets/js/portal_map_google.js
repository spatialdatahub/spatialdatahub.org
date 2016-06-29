// Dummy function
function addNumbersPortalMap(a,b) {
  return a + b;
};

var map;

// initialize map function, centered on the ZMT in Bremen
function initMap() {
  var mapOptions = {
    zoom: 2,
    center: {lat: 0, lng: 8.8460},
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
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


// actually initialize the map on page load. 
google.maps.event.addDomListener(window, "load", function() {
 initMap();
// map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');
// map.data.loadGeoJson('https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/google_dd_dataset.json');
});
