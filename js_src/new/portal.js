const L = require('leaflet') // do i need everything?
const omnivore = require('@mapbox/leaflet-omnivore') // how can i only import part of this
const markercluster = require('leaflet.markercluster')

//console.log(L.markerClusterGroup)

// how do I do this with the above files? Which functions do I need?
import within from '@turf/within'

// which is better?
//const en = require('easy-nominatim').en // this doesn't work because I haven't gotten require and export statments working correctly in easy-nominatim
import { getPlaceData, nominatim, normalizeGeoJSON, possiblePlaces } from 'easy-nominatim'

const filesaver = require('file-saver')

// easy-nominatim
// console.log(en)

// If I am only planning on having a single js file to deal with portal stuff, then why don't I
// just make it here. I guess I could just require it...
// I am going to start by putting it all in here

// //////// //
// index.js //
// //////// //
// ////////////////////////////////////////////////////////////////////////////
/*
// CUSTOM FUNCTIONS
*/
// A few of these functions are pretty much implemented by jQuery,
// I have an almost jQuery replacement that is already being used
// with bootstrap. It only implements the functions needed by bootstrap.
// maybe, instead of writing my own stuff, I should search through there
// and see if there are any functions available for me to use here.
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

// ////////////////////////// //
// indexMap.js and initMap.js //
// ////////////////////////// //
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

// ////////////// //
// datasetList.js //
// ////////////// //
// I have an idea, I will just make the dataset specific page work like a 
// dataset list page
// colors
const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red']
let linkDatasetColorCounter = 0 // this is for the datasets from the links

// pointMarkerOptions
const markerOptions = {
  radius: 6,
  color: 'black',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
}

const datasetLinksNodeList = document.getElementsByName('dataset')
const datasetLinks = Array.prototype.slice.call(datasetLinksNodeList)
const datasets = {}
const datasetClusters = {}
const activeDatasetButtons = []

let layerClusterState = 1 // 0 is layers, 1 is clusters

datasetLinks.forEach(function handleDatasetLink (link) {
  const pk = link.id
  const ext = link.value

  // this should be done better
  let url
  link.getAttribute('url')
    ? url = link.getAttribute('url')
    : url = `/load_dataset/${pk}`

   // deal with colors
  linkDatasetColorCounter++
  const color = colors[linkDatasetColorCounter % colors.length]

  // Every time I call the 'getDataset' function there needs to be a new modJson called
  // there should probably also be a marker cluster function called
  const layerMod = L.geoJson(null, {
    // set the points to little circles
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, markerOptions)
    },
    onEachFeature: (feature, layer) => {
      // make sure the fill is the color
      layer.options.fillColor = color
      // and make sure the perimiter is black (if it's a point) and the color otherwise
      feature.geometry.type === 'Point'
        ? layer.options.color = 'black'
        : layer.options.color = color
      // add those popups
      addPopups(feature, layer) // this comes from the index_maps.js file
    }
  })

  // How do I get markercluster in here?
  // I would like to be able to turn it on and off
  // is there a way to add data to both the layer and the marker cluster group at the same time
  const layerCluster = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      const textColor = color === 'blue' || color === 'purple' || color === 'green' ? 'white' : 'black'
      return L.divIcon({ html: `<div style="text-align: center; background-color: ${color}; color: ${textColor}"><b>${cluster.getChildCount()}</b></div>`,
                         iconSize: new L.Point(40, 20)
      })
    }
  })

  // how do I control markercluster with this
  // use layer state
  function linkEvent (link) {
    classToggle(link, 'active')


    // start simple, then make it into nice functions. It'll be ugly and hacky, then refactored to something good
    if (layerClusterState === 0) {
     // do all this stuff, but use layers 
     datasets[pk]
      ? myMap.hasLayer(datasets[pk])
        ? myMap.removeLayer(datasets[pk])
        : myMap.addLayer(datasets[pk]) //.fitBounds(datasets[pk].getBounds())

      // if there is no datasets[pk] then go through the process of selecting
      // the right omnivore function and getting the data and stuff
      // this is where i deal with the markercluster stuff
      : extSelect(ext, url) // the promise
        .then( function handleResponse (response) {
          layerMod.addData(response.toGeoJSON()) // modify the layer
          layerCluster.addLayer(layerMod)
          // use layerCluster instead of layerMod
          myMap.addLayer(layerMod)//.fitBounds(layerMod.getBounds())

          // add cluster to cluster container and layer to layer container
          // use this for toggling between clusters and layers
          addDataToContainer(layerMod, datasets, pk)
          addDataToContainer(layerCluster, datasetClusters, pk)

        }, function handleError (error) {
          console.log(error)
        })
     
    } else {
      // do all this stuff, but use clusters
     datasets[pk]
      ? myMap.hasLayer(datasetClusters[pk])
        ? myMap.removeLayer(datasetClusters[pk])
        : myMap.addLayer(datasetClusters[pk]) //.fitBounds(datasets[pk].getBounds())

      // if there is no datasets[pk] then go through the process of selecting
      // the right omnivore function and getting the data and stuff
      // this is where i deal with the markercluster stuff
      : extSelect(ext, url) // the promise
        .then( function handleResponse (response) {
          layerMod.addData(response.toGeoJSON()) // modify the layer
          layerCluster.addLayer(layerMod)
          // use layerCluster instead of layerMod
          myMap.addLayer(layerCluster)//.fitBounds(layerMod.getBounds())

          // add cluster to cluster container and layer to layer container
          // use this for toggling between clusters and layers
          addDataToContainer(layerMod, datasets, pk)
          addDataToContainer(layerCluster, datasetClusters, pk)

        }, function handleError (error) {
          console.log(error)
        })
     
    }

    activeDatasetButtons.push(link)
  }

//  link.addEventListener('click', () => linkEvent(link))

  link.getAttribute('detail')
    ? linkEvent(link)
    : link.addEventListener('click', () => linkEvent(link))
})

// ////////// // 
// editMap.js //
// ////////// // 
// /////////////////////////////////////////////////////////////////////////
// nominatim
// /////////////////////////////////////////////////////////////////////////

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const showFindPlaceContainerButton = document.getElementById('show_find_place_container_button')
const findPlaceContainer = document.getElementById('find_place_container')

showFindPlaceContainerButton.addEventListener('click', function showPlaceContainer () {
  classToggle(showFindPlaceContainerButton, 'active')

  findPlaceContainer.style.display === 'none' || findPlaceContainer.style.display === ''
    ? findPlaceContainer.style.display = 'block'
    : findPlaceContainer.style.display = 'none'
})

// (2) get elements
const placeInput = document.getElementById('place_input')
const placeButton = document.getElementById('place_button')
const placeToggle = document.getElementById('place_toggle')
const selector = document.getElementById('selector')
const selectButton = document.getElementById('select_button')

// define containers
const possiblePlaceLayers = {} // this is where i keep the layers to query the map with
const selectedPlace = []

activeDatasetButtons.push(placeButton, placeToggle, selectButton)

function makeSelectorOptions (array) {
  selector.innerHTML = ''
  array.forEach(place => {
    const option = document.createElement('option')
    option.value = place.display_name
    const text = document.createTextNode(place.display_name)
    option.appendChild(text)
    selector.appendChild(option)

    const lyr = L.geoJson(place.geojson)
    possiblePlaceLayers[place.display_name] = lyr
  })
}

// add place(s) to the selector
placeButton.addEventListener('click', function findPlace () {
  const val = placeInput.value
  en.getPlaceData(val, makeSelectorOptions)
})

function getSelectedPlacePolygon (sp) {
  // first make sure that sp has something
  if (sp[0]) {
    // maybe this should just be a function that returns the polygon if it's there
    const selectedPlaceType = sp[0].toGeoJSON().features[0].geometry.type
    if (selectedPlaceType === 'Polygon' || selectedPlaceType === 'MultiPolygon') {
      const p = sp[0]
      return p.toGeoJSON()
    } else {
      return 'not a polygon'
    }
  } else {
    return 'not a polygon'
  }  
}

// select place to display
selectButton.addEventListener('click', function selectPlace () {

  Object.keys(possiblePlaceLayers).forEach(n => {
    const p = possiblePlaceLayers[n]
    myMap.removeLayer(p)
  })

  selectedPlace.length !== 0
    ? (selectedPlace.pop(), selectedPlace.push(possiblePlaceLayers[selector.value]))
    : selectedPlace.push(possiblePlaceLayers[selector.value])

  const lyr = selectedPlace[0]
  lyr.addTo(myMap)
  myMap.fitBounds(lyr.getBounds())
})

// map and layer should be arguements for a predefined function
placeToggle.addEventListener('click', () => {
  myMap.hasLayer(selectedPlace[0])
    ? myMap.removeLayer(selectedPlace[0])
    : myMap.addLayer(selectedPlace[0])
})

// /////////////////////////////////////////////////////////////////////////
// end nominatim
// /////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////
// test url
// /////////////////////////////////////////////////////////////////////////

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const showTestUrlContainerButton = document.getElementById('show_test_url_container_button')
const testUrlContainer = document.getElementById('test_url_container')

showTestUrlContainerButton.addEventListener('click', function showTestUrlContainer () {

  classToggle(showTestUrlContainerButton, 'active')

  testUrlContainer.style.display === 'none' || testUrlContainer.style.display === ''
    ? testUrlContainer.style.display = 'block'
    : testUrlContainer.style.display = 'none'
})

// (2) get elements
const testUrlInput = document.getElementById('test_url_input')
const getTestUrl = document.getElementById('get_test_url')
const toggleTestUrlsButton = document.getElementById('toggle_test_urls')
const testUrls = document.getElementById('test_urls')

const testDatasets = {}
let testDatasetCount = 0

// pointMarkerOptions
const testUrlMarkerOptions = {
  radius: 6,
  color: 'white',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
}

getTestUrl.addEventListener('click', function getDataFromTestUrl () {
  // get ext and url
  const ext = getExt(testUrlInput.value)
  const url = testUrlInput.value

  // increment the color counter
  testDatasetCount++
  const testDatasetColor = colors[testDatasetCount % colors.length]

  // get the data with the correct ext, why is this stuff different than
  // the  functions we already have? I'll refactor later
  extSelect(ext, url)
    .then(function handleResponse (response) {
      // make this into a layer
      const layerMod = L.geoJson(null, {
        // set the points to little circles
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, markerOptions)
        },
        onEachFeature: (feature, layer) => {
          // make sure the fill is the color
          layer.options.fillColor = testDatasetColor
          // and make sure the perimiter is black (if it's a point) and the color otherwise
          feature.geometry.type === 'Point'
            ? layer.options.color = 'white'
            : layer.options.color = testDatasetColor
          // add those popups
          addPopups(feature, layer) // this comes from the index_maps.js file
        }
      })

      // if the response is good then add abutton for it
      // Ugh, I'm using the 'this' keyword. Not cool.
      // refactor later
      const btn = addButton(testDatasetCount, testDatasetColor, testUrls)

      activeDatasetButtons.push(btn)

      btn.addEventListener('click', function () {
        classToggle(btn, 'active')
        const val = btn.getAttribute('value')
        myMap.hasLayer(testDatasets[val])
          ? myMap.removeLayer(testDatasets[val])
          : myMap.addLayer(testDatasets[val])
      })

      // modify data here
      layerMod.addData(response.toGeoJSON())

      testDatasets[testDatasetCount] = layerMod

      myMap.addLayer(layerMod).fitBounds(layerMod.getBounds())
    }, function handleError (error) {
      console.log(error)
    })
})

// /////////////////////////////////////////////////////////////////////////
// end test url
// /////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////
// within polygon
// /////////////////////////////////////////////////////////////////////////

const fileContainer = []

// (1) hide and show nominatim stuff (do this after I've gotten it working)
// rename this to showWithinPolygonContainer
const showWithinPolygonContainerButton = document.getElementById('show_within_polygon_container_button')
const withinPolygonContainer = document.getElementById('within_polygon_container')

// Instead of making a button here makeit in the html, and display/hide it here
// (2) make buttons that will get the data
const getDataWithinPolygonButton = addButton('Get data within polygon', 'black', withinPolygonContainer)
getDataWithinPolygonButton.setAttribute('class', 'btn btn-default')

function showWithinPolygonContainerFunc () {
  classToggle(showWithinPolygonContainerButton, 'active')

  if (getSelectedPlacePolygon(selectedPlace) !== 'not a polygon') {
    withinPolygonContainer.innerHTML = '' // why doesn't this clear everything in the container?
    withinPolygonContainer.appendChild(getDataWithinPolygonButton)
  } else {
    withinPolygonContainer.innerHTML = '<h4>You need a polygon first, get one with the' +
    ' place selector or draw one.</h4>'
  }

  withinPolygonContainer.style.display === 'none' || withinPolygonContainer.style.display === ''
    ? withinPolygonContainer.style.display = 'block'
    : withinPolygonContainer.style.display = 'none'
}

function saveFile (layer, fileNameInput) {
  const filename = fileNameInput.value
  const data = JSON.stringify(layer.toGeoJSON())
  const blob = new Blob([data], {type: 'text/plain; charset=utf-8'})
  filesaver.saveAs(blob, filename + '.geojson')
}

function getDataWithinPolygonFunc (poly, layer) {
  const pointsLayers = Object.keys(testDatasets).map(k => {
    const v = testDatasets[k]
    if (myMap.hasLayer(v)) {
      const l = v.toGeoJSON().features[0].geometry.type
      if (l === 'Point' || l === 'MultiPoint') {
        return v.toGeoJSON()
      }
    }
  })

  // run the turf.within function, and add the data to the layer that will
  // be added to the map, and also converted to geojson and saved.
  
  pointsLayers.forEach(l => {
    //const n = turf.within(l, poly)
    const n = within(l, poly)
    layer.addData(n)
  })

  // return a layer with the points
  return layer
}

showWithinPolygonContainerButton.addEventListener('click', showWithinPolygonContainerFunc)

getDataWithinPolygonButton.addEventListener('click', () => {
  // This is pretty ugly, but right now it works, it will be
  // refactored

  const pointsWithinLayer = L.geoJSON(null).addTo(myMap)
  getDataWithinPolygonFunc(getSelectedPlacePolygon(selectedPlace), pointsWithinLayer)

  if (document.getElementById('file_name_input')) {
    var fni = document.getElementById('file_name_input')
    var fsb = document.getElementById('file_save_button')
    fni.parentNode.removeChild(fni)
    fsb.parentNode.removeChild(fsb)
  }

  // How do I delete this input and save button and re create them on every button press
  // make file name input
  const fileNameInput = document.createElement('input')
  fileNameInput.id = 'file_name_input'
  fileNameInput.setAttribute('class', 'form-control')
  fileNameInput.setAttribute('placeholder', 'Enter the file name here')
  fileNameInput.setAttribute('type', 'text')
  withinPolygonContainer.appendChild(fileNameInput)

  // Instead of having a save button, I should just have the html in the template
  // make save button
  const saveButton = addButton('Save to geojson file', 'black', withinPolygonContainer)
  saveButton.id = 'file_save_button'
  saveButton.classList.remove('active')
  saveButton.addEventListener('click', () => saveFile(pointsWithinLayer, fileNameInput))

})

// (3) add event listener to button that gets the data

// should this function be defined separately, and have arguements?

////////////////////////////////////////////////////////////////////////
// This button/function converts the polygon stored in the selectedPlace
// container and coverts it to geojson. It then gets all the active points
// layers from the map and checks if they fall within a polygon. If they
// are in the polygon, then they are added to a leaflet geojson layer
// which is added to the map. This layer can then be saved to a file
// using the 'filesaver' javascript script functionality. The function
// creates buttons that save the data to a file, and clears the data
// from the saved 
////////////////////////////////////////////////////////////////////////


// clear map
// get button and add click event

const clearMapButton = document.getElementById('clear_map')

clearMapButton.addEventListener('click', function clearMap () {
  // toggle 'active' class off
  activeDatasetButtons.forEach(function deactivate (link) {
    link.classList.remove('active')
  })

  // get all layers from map
  myMap.eachLayer(function clearLayers (layer) {
    // make sure not to remove tile layers
    if (layer !== osm && layer !== stamenToner && layer !== esriWorldImagery) {
      // remove layers
      myMap.removeLayer(layer)
    }
  })
})

// /////////////////////////////////////////////////////////////////////////
// toggle marker clusters
// Now I need to make the data addition thing work with this
// /////////////////////////////////////////////////////////////////////////

const toggleMarkerClustersButton = document.getElementById('toggle_marker_clusters')

function toggleMarkeClusters (map, layers, clusters) {
  /*
  // If the layer cluster state is 0, which means layers and not clusters, then the
  // function will 
  */


  if (layerClusterState === 0) {
    Object.keys(layers).forEach( key => {
      if (map.hasLayer(layers[key])) {
        map.removeLayer(layers[key])
        map.addLayer(clusters[key])
      } 
    })
    layerClusterState++
  } else {
    Object.keys(clusters).forEach( key => {
      if (map.hasLayer(clusters[key])) {
        map.removeLayer(clusters[key])
        map.addLayer(layers[key])
      } 
    } )
    layerClusterState--
  }

}

toggleMarkerClustersButton.addEventListener("click", function clusterToLayer () {
  toggleMarkeClusters(myMap, datasets, datasetClusters)
})




