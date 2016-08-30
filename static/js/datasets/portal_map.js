// set up the map
var myMap;
myMap = new L.Map('mapid');

// create base tile layer variable for map
var 	osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	minZoom:0, 
	maxZoom: 19 
});

// set map view and add base layer
myMap.setView({lat: 0, lng: 8.8460}, 2);
myMap.addLayer(osm);

// add layer providers to map 

// add GeoJSON dataset to map with jQuery ajax call
