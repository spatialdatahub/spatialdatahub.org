const L = require('leaflet')
// const omnivore = require('@mapbox/leaflet-omnivore')
const markercluster = require('leaflet.markercluster')

// how do I do this with the above files? Which functions do I need?
import within from '@turf/within'

import { getPlaceData, nominatim, normalizeGeoJSON, possiblePlaces } from 'easy-nominatim'

const filesaver = require('file-saver')

const basic = require('../pieces/basic.js')
const mapFunctions = require('../pieces/mapFunctions.js')

// Things I need to fix
// - filesaver doesn't save data from all sources, only the test urls
// - csv files (and possibly other non-geojson files) do not load on dataset detail page
// - the load data to page or get data function is loading clusters into the wrong containers
// - the toggle test datasets button is not toggling the datasets on and off


// ////////////////////////// //
// initMap.js //
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

// The initial value will start the page with either layers or clusters. 
let layerClusterState = 1 // 0 is layers, 1 is clusters. // something is wrong

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
      mapFunctions.addPopups(feature, layer) // this comes from the index_maps.js file
    }
  })

  // How do I get markercluster in here?
  // I would like to be able to turn it on and off
  // is there a way to add data to both the layer and the marker cluster group at the same time
  const layerCluster = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      const textColor = color === 'blue' || color === 'purple' || color === 'green' ? 'white' : 'black'
      return L.divIcon({ 
        html: `<div style="text-align: center; background-color: ${color}; color: ${textColor}"><b>${cluster.getChildCount()}</b></div>`,
        iconSize: new L.Point(40, 20)
      })
    }
  })


  // bring big switcher function out here
  // should this be two functions?
  // the points and clusters are being added to the wrong containers

  
  /*
  function getDatasetAndAddItToMap(map, primary, secondary, key) {
    primary[key]
      ? map.hasLayer(primary[key])
        ? map.removeLayer(primary[key])
        : map.addLayer(primary[key])

      : mapFunctions.extSelect(ext, url)
        .then( function handleResponse(response) {

          layerMod.addData(response.toGeoJSON())
          layerCluster.addLayer(layerMod)

          map.addLayer(layerMod) // here is the problem

          addDataToContainer(layerMod, primary, key) // there is a problem here, on the initial data addition the points go into the datasetCusters with out being converted to clusters
          addDataToContainer(layerCluster, secondary, key)
        }, function handleError (error) {
          console.log(error)
        })
  }
  */

  // how do I control markercluster with this
  // use layer state
  function linkEvent (link) {
    basic.classToggle(link, 'active')

    // start simple, then make it into nice functions. It'll be ugly and hacky, then refactored to something good
    if (layerClusterState === 0) {
    //  getDatasetAndAddItToMap(myMap, datasets, datasetClusters, pk)
    
     // do all this stuff, but use layers 
     datasets[pk]
      ? myMap.hasLayer(datasets[pk])
        ? myMap.removeLayer(datasets[pk])
        : myMap.addLayer(datasets[pk]) //.fitBounds(datasets[pk].getBounds())

      // if there is no datasets[pk] then go through the process of selecting
      // the right omnivore function and getting the data and stuff
      // this is where i deal with the markercluster stuff
      : mapFunctions.extSelect(ext, url) // the promise
        .then( function handleResponse (response) {
          layerMod.addData(response.toGeoJSON()) // modify the layer
          layerCluster.addLayer(layerMod)
          // use layerCluster instead of layerMod
          myMap.addLayer(layerMod)//.fitBounds(layerMod.getBounds())

          // add cluster to cluster container and layer to layer container
          // use this for toggling between clusters and layers
          basic.addDataToContainer(layerMod, datasets, pk)
          basic.addDataToContainer(layerCluster, datasetClusters, pk)

        }, function handleError (error) {
          console.log(error)
        })
    
     
    } else {
      //getDatasetAndAddItToMap(myMap, datasetClusters, datasets, pk)
      // do all this stuff, but use clusters
     
    
     datasets[pk]
      ? myMap.hasLayer(datasetClusters[pk])
        ? myMap.removeLayer(datasetClusters[pk])
        : myMap.addLayer(datasetClusters[pk]) //.fitBounds(datasets[pk].getBounds())

      // if there is no datasets[pk] then go through the process of selecting
      // the right omnivore function and getting the data and stuff
      // this is where i deal with the markercluster stuff
      : mapFunctions.extSelect(ext, url) // the promise
        .then( function handleResponse (response) {
          layerMod.addData(response.toGeoJSON()) // modify the layer
          layerCluster.addLayer(layerMod)
          // use layerCluster instead of layerMod
          myMap.addLayer(layerCluster)//.fitBounds(layerMod.getBounds())

          // add cluster to cluster container and layer to layer container
          // use this for toggling between clusters and layers
          basic.addDataToContainer(layerMod, datasets, pk)
          basic.addDataToContainer(layerCluster, datasetClusters, pk)

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
  basic.classToggle(showFindPlaceContainerButton, 'active')

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
  if (sp[0]) {
    const p = sp[0].toGeoJSON()
    const spt = p.features[0].geometry.type // spt = selected place type

    if (spt === 'Polygon' || spt === 'MultiPolygon') {
      return p
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

  basic.classToggle(showTestUrlContainerButton, 'active')

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
  const ext = basic.getExt(testUrlInput.value)
  const url = testUrlInput.value

  // increment the color counter
  testDatasetCount++
  const testDatasetColor = colors[testDatasetCount % colors.length]

  // get the data with the correct ext, why is this stuff different than
  // the  functions we already have? I'll refactor later
  mapFunctions.extSelect(ext, url)
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
          mapFunctions.addPopups(feature, layer) // this comes from the index_maps.js file
        }
      })

      // if the response is good then add abutton for it
      // Ugh, I'm using the 'this' keyword. Not cool.
      // refactor later
      const btn = basic.addButton(testDatasetCount, testDatasetColor, testUrls)

      activeDatasetButtons.push(btn)

      btn.addEventListener('click', function () {
        basic.classToggle(btn, 'active')
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
const getDataWithinPolygonButton = basic.addButton('Get data within polygon', 'black', withinPolygonContainer)
getDataWithinPolygonButton.setAttribute('class', 'btn btn-default')

function showWithinPolygonContainerFunc () {
  basic.classToggle(showWithinPolygonContainerButton, 'active')

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
    const fni = document.getElementById('file_name_input')
    const fsb = document.getElementById('file_save_button')
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
  const saveButton = basic.addButton('Save to geojson file', 'black', withinPolygonContainer)
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


function pctoggler (map, obj1, obj2) {
  Object.keys(obj1).forEach( key => {
    if (map.hasLayer(obj1[key])) {
      map.removeLayer(obj1[key])
      map.addLayer(obj2[key])
    } 
  })
}

function toggleMarkerClusters (map, layers, clusters) {
  /*
  // If the layer cluster state is 0, which means layers and not clusters, then the
  // function will 
  */

  if (layerClusterState === 0) {
    pctoggler(map, layers, clusters)
    layerClusterState++
  } else {
    pctoggler(map, clusters, layers)
    layerClusterState--
  }

}

toggleMarkerClustersButton.addEventListener("click", function clusterToLayer () {
  toggleMarkerClusters(myMap, datasets, datasetClusters)
})




