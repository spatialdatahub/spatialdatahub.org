// Start with a bunch of stuff from other libraries, then add code from my own libraries
const osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">
  OpenStreetMap</a>`,
  minZoom: 2,
  maxZoom: 19
})

const stamenToner = L.tileLayer(`http://stamen-tiles-{s}.a.ssl.fastly.net/
toner/{z}/{x}/{y}.{ext}`, {
  attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
  <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>
  &mdash; Map data &copy;
  <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
  subdomains: 'abcd',
  minZoom: 2,
  maxZoom: 19,
  ext: 'png'
})

const esriWorldImagery = L.tileLayer(`http://server.arcgisonline.com/ArcGIS/
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

// now for my own JS
const dataset = []
const pk = document.getElementById('dataset_pk').getAttribute('value')
const ext = document.getElementById('dataset_ext').getAttribute('value')

let url

// owncloud?
document.getElementById('owncloud').getAttribute('value')
  ? url = `/owncloud_dataset/${pk}`
  : url = `/load_dataset/${pk}`

const color = 'red' // I'm going to make a color selector element, and take the value

// if dataset is point dataset add filter elements
// there must be a better way to do this
const createFilterElements = () => {
  // create elements, one by one
  const submitValuesButton = document.createElement('button')
  submitValuesButton.setAttribute('id', 'submit_values_button')

  const resetValuesButton = document.createElement('button')
  resetValuesButton.setAttribute('id', 'reset_values_button')

  const lngMinInput = document.createElement('input')
  lngMinInput.setAttribute('id', 'lng_min_input')

  const lngMaxInput = document.createElement('input')
  lngMaxInput.setAttribute('id', 'lng_max_input')

    // given that the geometry type of the dataset is a point, include latlng
    layer.feature.geometry.type === 'Point' ?
      popupContent.push(
        `<b>Latitude:</b> ${layer.feature.geometry.coordinates[1]}`,
        `<b>Longitude:</b> ${layer.feature.geometry.coordinates[0]}`
      ) : console.log(layer.feature.geometry.type)
    layer.bindPopup(popupContent.join('<br/>'))
}


// pointMarkerOptions
const markerOptions = {
  radius: 6,
  color: color,
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
}

let filteredLayer = L.geoJson(null, {

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
    addPopups(feature, layer)
  }

})

getDataset(myMap, dataset, pk, ext, url, filteredLayer)

// what next
