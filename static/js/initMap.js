'use strict';

// These functions are being called and not defined...
// but they are run in all the map pages
// Start with a bunch of stuff from other libraries, then add code from my own libraries
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">\n  OpenStreetMap</a>',
  minZoom: 2,
  maxZoom: 19
});

var stamenToner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/\ntoner/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>,\n  <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>\n  &mdash; Map data &copy;\n  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 2,
  maxZoom: 19,
  ext: 'png'
});

var esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/\nrest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA,\n  USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP,\n  and the GIS User Community'
});

var myMap = L.map('mapid', {
  center: { lat: 0, lng: 8.8460 },
  zoom: 2,
  layers: osm,
  scrollWheelZoom: false
});

var baseLayers = {
  'Open Street Maps': osm,
  'Black and White': stamenToner,
  'ESRI World Map': esriWorldImagery
};

var baseLayerControl = L.control.layers(baseLayers);
baseLayerControl.addTo(myMap);

// watermark leaflet control
L.control.watermark = function (options) {
  return new L.Control.Watermark(options);
};
L.control.watermark({ position: 'bottomleft' }).addTo(myMap);

// home button leaflet control
L.control.homebutton = function (options) {
  return new L.Control.HomeButton(options);
};
L.control.homebutton({ position: 'topleft' }).addTo(myMap);

// toggle scroll button leaflet control
L.control.togglescrollbutton = function (options) {
  return new L.Control.ToggleScrollButton(options);
};
L.control.togglescrollbutton({ position: 'topleft' }).addTo(myMap);

// Trying to add 'alt' to tile layers
osm.on('tileload', function (tileEvent) {
  tileEvent.tile.setAttribute('alt', 'Open Street Map Tile Layer');
});

stamenToner.on('tileload', function (tileEvent) {
  tileEvent.tile.setAttribute('alt', 'Stamen Toner black and white tile layers');
});

esriWorldImagery.on('tileload', function (tileEvent) {
  tileEvent.tile.setAttribute('alt', 'ESRI World Imagery Tile');
});