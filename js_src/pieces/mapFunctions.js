const L = require('leaflet')
const omnivore = require('@mapbox/leaflet-omnivore')

// /////////// //
// indexMap.js //
// /////////// //

// should these functions be rewritten?
// How can I make them take only one arg each?
// That wouldn't work, because I have to take both the url,
// and the ext as arguements.

// I could just use the ext, to decide which one of the url

// 1) promisified omnivore functions
// these should probably be refactored
// they don't need to be exposed to the rest of the code base
// they are only used here
const getGeoJSON = function (url) {
  return new Promise(function handlePromise (resolve, reject) {
    const dataLayer = omnivore.geojson(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

const getKML = function (url) {
  return new Promise(function handlePromise (resolve, reject) {
    const dataLayer = omnivore.kml(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

const getCSV = function (url) {
  return new Promise(function handlePromise (resolve, reject) {
    const dataLayer = omnivore.csv(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

// 2) function to choose which omnivore function to run
// should I write getCSV getKML and getGeoJSON as object
// methods and call them?
const extSelect = function (ext, url, handlePromise) {
  const prom = ext === 'kml'
    ? getKML(url)
    : ext === 'csv'
      ? getCSV(url)
      : getGeoJSON(url)
  // should I have a 'handlePromise function?'
  // yes, and it goes right here
  return prom
}

// I need to make a nice looking popup background that scrolls
// why isn't this in the add popups function?
// innerHTML doesn't work on this, because it's still a string in this document
// just make it part of the set content thing
//const popupHtml = '<dl id="popup-content"></dl>'

// add popups to the data points
// should this function be called every time a layer is added to a map?
// or will the layer still have the popups after it's toggled off and on?

const checkFeatureProperties = function (feature) {
  return Object.keys(feature.properties)
    .map(key => `<dt>${key}</dt> <dd>${feature.properties[key]}</dd>`)
}

const latLngPointOnFeature = function (feature) {
  return feature.geometry.type === 'Point'
    ? [
        `<dt>Latitude:</dt> <dd>${feature.geometry.coordinates[1]}</dd>`,
        `<dt>Longitude:</dt> <dd>${feature.geometry.coordinates[0]}</dd>`
      ]
    : ['']
}

const addPopups = function (feature, layer) {
  
  const popupContent = checkFeatureProperties(feature)
    .concat(latLngPointOnFeature(feature))
    .map(x => x)

  const content = `<dl id="popup-content">${popupContent.join('')}</dl>`
  const popup = L.popup().setContent(content)

  layer.bindPopup(popup)
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

module.exports = {
  getGeoJSON: getGeoJSON,
  getKML: getKML,
  getCSV: getCSV,
  extSelect: extSelect,
  checkFeatureProperties: checkFeatureProperties,
  latLngPointOnFeature: latLngPointOnFeature, 
  addPopups: addPopups
}
