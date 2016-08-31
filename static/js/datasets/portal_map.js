// create base tile layer variable for map
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	minZoom:0, 
	maxZoom: 19 
});


// create layer group and add base tile layer to layer group
var baseLayer = L.layerGroup();
baseLayer.addLayer(osm);


// set up map, view and base layer
// set up the map
var myMap;
myMap = new L.Map('mapid', {
	center: {lat: 0, lng: 8.8460}, 
	zoom: 2,
	layers: baseLayer
});


// add layer providers to map 

// create layer group to add datasets too
var datasets = L.layerGroup();

// add GeoJSON dataset to map with jQuery ajax call
var geoJsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Leibniz-Zentrum für Marine Tropenökologie",
        "type": "Research Institute",
        "popupContent": "This is where the ZMT is located!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [8.846278, 53.108312]
    }
};

datasets.addLayer(geoJsonFeature);
