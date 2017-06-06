(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
          doc = view.document
          // only get URL when necessary in case Blob.js hasn't overridden it yet
        , get_URL = function() {
            return view.URL || view.webkitURL || view;
        }
        , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
        , can_use_save_link = "download" in save_link
        , click = function(node) {
            var event = new MouseEvent("click");
            node.dispatchEvent(event);
        }
        , is_safari = /constructor/i.test(view.HTMLElement) || view.safari
        , is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
        , throw_outside = function(ex) {
            (view.setImmediate || view.setTimeout)(function() {
                throw ex;
            }, 0);
        }
        , force_saveable_type = "application/octet-stream"
        // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
        , arbitrary_revoke_timeout = 1000 * 40 // in ms
        , revoke = function(file) {
            var revoker = function() {
                if (typeof file === "string") { // file is an object URL
                    get_URL().revokeObjectURL(file);
                 } else { // file is a File
                    file.remove();
                 }
            };
            setTimeout(revoker, arbitrary_revoke_timeout);
        }
        , dispatch = function(filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver);
                    } catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        }
        , auto_bom = function(blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
            }
            return blob;
        }
        , FileSaver = function(blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            // First try a.download, then web filesystem, then object URLs
            var
                  filesaver = this
                , type = blob.type
                , force = type === force_saveable_type
                , object_url
                , dispatch_all = function() {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
                // on any filesys errors revert to saving with object URLs
                , fs_error = function() {
                    if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                        // Safari doesn't allow downloading of blob urls
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                            var popup = view.open(url, '_blank');
                            if(!popup) view.location.href = url;
                            url=undefined; // release reference before dispatching
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                        };
                        reader.readAsDataURL(blob);
                        filesaver.readyState = filesaver.INIT;
                        return;
                    }
                    // don't create more object URLs than needed
                    if (!object_url) {
                        object_url = get_URL().createObjectURL(blob);
                    }
                    if (force) {
                        view.location.href = object_url;
                    } else {
                        var opened = view.open(object_url, "_blank");
                        if (!opened) {
                            // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                            view.location.href = object_url;
                        }
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                }
            ;
            filesaver.readyState = filesaver.INIT;

            if (can_use_save_link) {
                object_url = get_URL().createObjectURL(blob);
                setTimeout(function() {
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    dispatch_all();
                    revoke(object_url);
                    filesaver.readyState = filesaver.DONE;
                });
                return;
            }

            fs_error();
        }
        , FS_proto = FileSaver.prototype
        , saveAs = function(blob, name, no_auto_bom) {
            return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
        }
    ;
    // IE 10+ (native saveAs)
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function(blob, name, no_auto_bom) {
            name = name || blob.name || "download";

            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            return navigator.msSaveOrOpenBlob(blob, name);
        };
    }

    FS_proto.abort = function(){};
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
    FS_proto.onwritestart =
    FS_proto.onprogress =
    FS_proto.onwrite =
    FS_proto.onabort =
    FS_proto.onerror =
    FS_proto.onwriteend =
        null;

    return saveAs;
}(
       typeof self !== "undefined" && self
    || typeof window !== "undefined" && window
    || this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define("FileSaver.js", function() {
    return saveAs;
  });
}

},{}],2:[function(require,module,exports){
// ////////////////////////////////////////////////////////////////////////////
/*
// CUSTOM FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////

// function to add data to a container
// is this function completely unnecessary?
function addDataToContainer(data, obj, key) {
  return obj[key] = data;
}

// this should probably be in the index of helper functions
// makeReq function
function dataToDiv(data, div) {
    return div.innerHTML = data;
}

// toggle active / inactive links in list
// almost exactly copied from 'youmightnotneedjquery.com'
function classToggle (el, className) {
  /*
    Toggle class on element. Click element once to turn it on,
    and again to turn it off, or vis versa.
  */
  if (el.classList) {
    el.classList.toggle(className)
  } else {
    const classes = el.className.split(' ')
    const existingIndex = classes.indexOf(className)
    if (existingIndex >= 0) {
      classes.splice(existingIndex, 1)
    } else {
      classes.push(className)
    }
    el.className = classes.join(' ')
  }
}

function classToggleOnDiffLink(el, elList, className) {
  /*
    Toggle class on element, but with multiple elements.
    Click element 1 once to turn class on, and click element 2
    to turn class off for element 1, and to turn class on
    for element 2.

    Just turn class off for everything in element list,
    and then add class to element that was clicked.
  */

  // first remove className from all elements
  elList.forEach(e => {
    if (e.classList) {
      e.classList.remove(className)
    }
  })

  // then add className to element that was clicked
  const classes = el.className.split(' ')
  classes.push(className)
  el.className = classes.join(' ')
}

// make function that gets the ext of the url
// it can handle csv, kml, json, and geojson
function getExt(string) {
  const ext = {}
  const stringLower = string.toLowerCase()
  stringLower.endsWith('kml')
  ? ext[0] = 'kml'
  : stringLower.endsWith('csv')
  ? ext[0] = 'csv'
  : stringLower.endsWith('json')
  ? ext[0] = 'geojson'
  : console.log(stringLower)
  return ext[0]
}

// make function for adding buttons
function addButton(text, color, container) {
  const btn = document.createElement('button')
  const value = document.createTextNode(text)
  btn.setAttribute('class', 'btn btn-default active') // this should be changed to not active, and the active thing should be added on the specific function
  btn.setAttribute('value', text)
  btn.setAttribute('id', `newbutton${btn.value}`)

  // make the color of the number correspond
  // to the color of the dataset on the map
  btn.style.color = color
  btn.style.fontWeight = 'bold'

  // add text to button and button to div
  btn.appendChild(value)
  container.appendChild(btn)

  return btn
}

// make the above function with fetch
function makeReq(url, func, div) {
  return fetch(url)
  .then(response => {
    if (!response.ok) {
      console.log('Looks like there has been a problem. Status code:', response.status)
    }
    return response.text()
  })
  .then(data => func(data, div))
  .catch(error => console.log('There has been a problem with the fetch operation: ', error))
}

module.exports = {
  addDataToContainer: addDataToContainer,
  dataToDiv: dataToDiv,
  classToggle: classToggle,
  classToggleOnDiffLink: classToggleOnDiffLink,
  getExt: getExt,
  addButton: addButton,
  makeReq: makeReq
}

},{}],3:[function(require,module,exports){
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
function getGeoJSON (url) {
  return new Promise(function handlePromise (resolve, reject) {
    const dataLayer = omnivore.geojson(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

function getKML (url) {
  return new Promise(function handlePromise (resolve, reject) {
    const dataLayer = omnivore.kml(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

function getCSV (url) {
  return new Promise(function handlePromise (resolve, reject) {
    const dataLayer = omnivore.csv(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

// 2) function to choose which omnivore function to run
function extSelect (ext, url) {
  return ext === 'kml'
    ? getKML(url)
    : ext === 'csv'
    ? getCSV(url)
    : getGeoJSON(url)
}

// I need to make a nice looking popup background that scrolls
// why isn't this in the add popups function?
// innerHTML doesn't work on this, because it's still a string in this document
// just make it part of the set content thing
//const popupHtml = '<dl id="popup-content"></dl>'

// add popups to the data points
// should this function be called every time a layer is added to a map?
// or will the layer still have the popups after it's toggled off and on?
function addPopups (feature, layer) {
  const popupContent = []

  // first check if there are properties
  feature.properties.length !== undefined || feature.properties.length !== 0
    // push data from the dataset to the array
    ? Object.keys(feature.properties).forEach(key => {
      popupContent.push(`<dt>${key}</dt> <dd>${feature.properties[key]}</dd>`)
    })
    : console.log('No feature properties')

  // push feature cordinates to the popupContent array, if it's a point dataset
  feature.geometry.type === 'Point'
    ? popupContent.push(
        `<dt>Latitude:</dt> <dd>${feature.geometry.coordinates[1]}</dd>`,
        `<dt>Longitude:</dt> <dd>${feature.geometry.coordinates[0]}</dd>`
      )
    : console.log(feature.geometry.type)

  // set max height and width so popup will scroll up and down, and side to side
  const popupOptions = {
//    maxHeight: 300,
//    maxWidth: 300,
//    autoPanPaddingTopLeft: [50, 50],
//    autoPanPaddingTopRight: [50, 50]
  }


  const content = `<dl id="popup-content">${popupContent.join('')}</dl>`

  const popup = L.popup(popupOptions).setContent(content)

  layer.bindPopup(popup)

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
  onAdd: (map) => {
    const img = L.DomUtil.create('img')
    // this will have to be changed relative to the site for production
    img.src = '/static/images/zmt_logo_blue_black_100px.png'
    // img.src = imgSrc
    img.style.width = '100px'
    return img
  },
  onRemove: (map) => {
    // Nothing to do here
  }
})

// Home button by extending Leaflet Control
L.Control.HomeButton = L.Control.extend({
  onAdd: (map) => {
    const container = L.DomUtil.create('div',
      'leaflet-bar leaflet-control leaflet-control-custom')
    //  container.innerHTML = '<i class="fa fa-home fa-2x" aria-hidden="true"></i>'
    container.style.backgroundImage = 'url("/static/images/home_icon.png")'
    container.style.backgroundRepeat = 'no-repeat'
    container.style.backgroundColor = 'white'
    container.style.width = '34px'
    container.style.height = '34px'
    container.addEventListener('click', () => map.setView({lat: 0, lng: 0}, 2))
    return container
  },
  onRemove: (map) => {
    // Nothing to do here
  }
})

// scroll wheel toggle button
L.Control.ToggleScrollButton = L.Control.extend({
  onAdd: (map) => {
    const container = L.DomUtil.create('div',
      'leaflet-bar leaflet-control leaflet-control-custom')
    // container.style.backgroundImage = 'url("http://localhost:8000/static/images/mouse.png")'
    container.style.backgroundImage = 'url("/static/images/mouse.png")'
    container.style.backgroundRepeat = 'no-repeat'
    container.style.backgroundColor = 'white'
    container.style.width = '34px'
    container.style.height = '34px'
    container.addEventListener('click', () => {
      map.scrollWheelZoom.enabled()
        ? map.scrollWheelZoom.disable()
        : map.scrollWheelZoom.enable()
    })
    return container
  },
  onRemove: (map) => {
    // Nothing to do here
  }
})

},{}],4:[function(require,module,exports){
// These functions are being called and not defined...
// but they are run in all the map pages
// Start with a bunch of stuff from other libraries, then add code from my own libraries
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">
  OpenStreetMap</a>`,
  minZoom: 2,
  maxZoom: 19
})

const stamenToner = L.tileLayer(`https://stamen-tiles-{s}.a.ssl.fastly.net/
toner/{z}/{x}/{y}.{ext}`, {
  attribution: `Map tiles by <a href="https://stamen.com">Stamen Design</a>,
  <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>
  &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
  subdomains: 'abcd',
  minZoom: 2,
  maxZoom: 19,
  ext: 'png'
})

const esriWorldImagery = L.tileLayer(`https://server.arcgisonline.com/ArcGIS/
rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`, {
  attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA,
  USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP,
  and the GIS User Community`
})

const myMap = L.map('mapid', {
  center: {lat: 0, lng: 8.8460},
  zoom: 2,
  layers: osm,
  scrollWheelZoom: false
})

const baseLayers = {
  'Open Street Maps': osm,
  'Black and White': stamenToner,
  'ESRI World Map': esriWorldImagery
}

const baseLayerControl = L.control.layers(baseLayers)
baseLayerControl.addTo(myMap)

// watermark leaflet control
L.control.watermark = (options) => new L.Control.Watermark(options)
L.control.watermark({position: 'bottomleft'}).addTo(myMap)

// home button leaflet control
L.control.homebutton = (options) => new L.Control.HomeButton(options)
L.control.homebutton({position: 'topleft'}).addTo(myMap)

// toggle scroll button leaflet control
L.control.togglescrollbutton = (options) => new L.Control.ToggleScrollButton(options)
L.control.togglescrollbutton({position: 'topleft'}).addTo(myMap)

// Trying to add 'alt' to tile layers
osm.on('tileload', function (tileEvent) {
  tileEvent.tile.setAttribute('alt', 'Open Street Map Tile Layer')
})

stamenToner.on('tileload', function (tileEvent) {
  tileEvent.tile.setAttribute('alt', 'Stamen Toner black and white tile layers')
})

esriWorldImagery.on('tileload', function (tileEvent) {
  tileEvent.tile.setAttribute('alt', 'ESRI World Imagery Tile')
})

},{}],5:[function(require,module,exports){
require('../index.js')
const indexMap = require('../indexMap.js')
const initMap = require('../initMap.js')
const filesaver = require('../filesaver.js')

},{"../filesaver.js":1,"../index.js":2,"../indexMap.js":3,"../initMap.js":4}]},{},[5]);
