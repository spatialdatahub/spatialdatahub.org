'use strict';

// ////////////////////////////////////////////////////////////////////////////
/*
// CUSTOM MAP FUNCTIONS
*/
/*
// As I get better at programming I will try and put more functions in here
// but for right now I'm going to keep most of the javascript in the page
// specific javascript files.
*/
// ////////////////////////////////////////////////////////////////////////////

// 1) promisified omnivore functions
// these should probably be refactored
function getGeoJSON(url) {
  return new Promise(function handlePromise(resolve, reject) {
    var dataLayer = omnivore.geojson(url).on('ready', function () {
      return resolve(dataLayer);
    }).on('error', function () {
      return reject(Error('Url problem...'));
    });
  });
}

function getKML(url) {
  return new Promise(function handlePromise(resolve, reject) {
    var dataLayer = omnivore.kml(url).on('ready', function () {
      return resolve(dataLayer);
    }).on('error', function () {
      return reject(Error('Url problem...'));
    });
  });
}

function getCSV(url) {
  return new Promise(function handlePromise(resolve, reject) {
    var dataLayer = omnivore.csv(url).on('ready', function () {
      return resolve(dataLayer);
    }).on('error', function () {
      return reject(Error('Url problem...'));
    });
  });
}

// 2) function to choose which omnivore function to run
function extSelect(ext, url) {
  return ext === 'kml' ? getKML(url) : ext === 'csv' ? getCSV(url) : getGeoJSON(url);
}

// I need to make a nice looking popup background that scrolls
// why isn't this in the add popups function?
// innerHTML doesn't work on this, because it's still a string in this document
// just make it part of the set content thing
//const popupHtml = '<dl id="popup-content"></dl>'

// add popups to the data points
// should this function be called every time a layer is added to a map?
// or will the layer still have the popups after it's toggled off and on?
function addPopups(feature, layer) {
  var popupContent = [];

  // first check if there are properties
  feature.properties.length !== undefined || feature.properties.length !== 0
  // push data from the dataset to the array
  ? Object.keys(feature.properties).forEach(function (key) {
    popupContent.push('<dt>' + key + '</dt> <dd>' + feature.properties[key] + '</dd>');
  }) : console.log('No feature properties');

  // push feature cordinates to the popupContent array, if it's a point dataset
  feature.geometry.type === 'Point' ? popupContent.push('<dt>Latitude:</dt> <dd>' + feature.geometry.coordinates[1] + '</dd>', '<dt>Longitude:</dt> <dd>' + feature.geometry.coordinates[0] + '</dd>') : console.log(feature.geometry.type);

  // set max height and width so popup will scroll up and down, and side to side
  var popupOptions = {
    //    maxHeight: 300,
    //    maxWidth: 300,
    //    autoPanPaddingTopLeft: [50, 50],
    //    autoPanPaddingTopRight: [50, 50]
  };

  var content = '<dl id="popup-content">' + popupContent.join('') + '</dl>';

  var popup = L.popup(popupOptions).setContent(content);

  layer.bindPopup(popup);

  // make array to add content to
  /*
   // bind the popupContent array to the layer's layers
  layer.bindPopup(popupHtml.innerHTML=popupContent.join('')) // this is where the popup html will be implemented
  */
}

// THESE THREE CONTROL FUNCTIONS ARE TIGHTLY COUPLED WITH DIFFERENT THINGS
// THEY WILL HAVE TO BE CHANGED EVENTUALLY
// ZMT watermark by extending Leaflet Control
L.Control.Watermark = L.Control.extend({
  onAdd: function onAdd(map) {
    var img = L.DomUtil.create('img');
    // this will have to be changed relative to the site for production
    img.src = '/static/images/zmt_logo_blue_black_100px.png';
    // img.src = imgSrc
    img.style.width = '100px';
    return img;
  },
  onRemove: function onRemove(map) {
    // Nothing to do here
  }
});

// Home button by extending Leaflet Control
L.Control.HomeButton = L.Control.extend({
  onAdd: function onAdd(map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    //  container.innerHTML = '<i class="fa fa-home fa-2x" aria-hidden="true"></i>'
    container.style.backgroundImage = 'url("/static/images/home_icon.png")';
    container.style.backgroundRepeat = 'no-repeat';
    container.style.backgroundColor = 'white';
    container.style.width = '34px';
    container.style.height = '34px';
    container.addEventListener('click', function () {
      return map.setView({ lat: 0, lng: 0 }, 2);
    });
    return container;
  },
  onRemove: function onRemove(map) {
    // Nothing to do here
  }
});

// scroll wheel toggle button
L.Control.ToggleScrollButton = L.Control.extend({
  onAdd: function onAdd(map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    // container.style.backgroundImage = 'url("http://localhost:8000/static/images/mouse.png")'
    container.style.backgroundImage = 'url("/static/images/mouse.png")';
    container.style.backgroundRepeat = 'no-repeat';
    container.style.backgroundColor = 'white';
    container.style.width = '34px';
    container.style.height = '34px';
    container.addEventListener('click', function () {
      map.scrollWheelZoom.enabled() ? map.scrollWheelZoom.disable() : map.scrollWheelZoom.enable();
    });
    return container;
  },
  onRemove: function onRemove(map) {
    // Nothing to do here
  }
});

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