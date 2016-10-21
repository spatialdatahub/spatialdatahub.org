// This file has all the basic map stuff, if there are specific functions
// for specific pages they will be in their own javascript files
// writen with ES6
// One thing I should do is to create a special ZMT icon with a ZMT popup that looks cool.

// define DOM ready function
const domReady = function(callback) {
  document.readyState === "interactive" ||
  document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

// should everything be wrapped in a dom ready function? At least I can use it instead of the jQuery function

// create base tile layer variable for map
const osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  minZoom:0, 
  maxZoom: 19 
}),
stamenToner = L.tileLayer("http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}", {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: "abcd",
  minZoom: 0,
  maxZoom: 19,
  ext: "png"
}),
Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


// set up map, view and base layer
const myMap = new L.Map("mapid", {
  center: {lat: 0, lng: 8.8460}, 
  zoom: 2,
  layers: osm 
});

// create layer group and add base tile layers, then add it to the map
const baseLayers = {
  "Open Street Maps": osm,
  "Black and White": stamenToner,
  "ESRI World Map": Esri_WorldImagery 
};
baseLayerControl = L.control.layers(baseLayers);
baseLayerControl.addTo(myMap);


