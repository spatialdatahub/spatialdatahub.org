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



// to toggle active datasets on the map, and otherwise I need the list of datasets 
// should this be a const?
const datasetLinks = document.getElementsByName('dataset')
const datasets = {}

// colors 
const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red']
let colorCounter = 0

// pointMarkerOptions
const markerOptions = {
  radius: 6,
  color: 'black',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
}

// add event that toggles the link's class from active to not active
datasetLinks.forEach(link => {
  const ext = link.getAttribute('id')
  const pk = link.getAttribute('value')
  const url = `/load_dataset/${pk}`

  // deal with colors
  colorCounter++
  const color = colors[colorCounter % colors.length]

  // Every time I call the 'getDataset' function there needs to be a new modJson called
  // there should probably also be a marker cluster function called
  const layerMod = L.geoJson(null, {

    // set the points to little circles
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, markerOptions)
    },


    // set the colors of each layer, and add popups to everything
    onEachFeature: (feature, layer) => {
      // this is for the non-points
      if (feature.geometry.type !== 'Point') {
        layer.options.color = color
      }
      // make sure the perimeter of the circle is black, and the fill is the color
      layer.options.fillColor = color

      addPopups(feature, layer)
    }
  })

  // Make a markercluster group
  // this is going to suck, so i'm going to do it after i do something else.
/*
  const cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 50
  })
*/

  link.addEventListener('click', () => {
    classToggle(link, 'active')
    // (map, obj, key, url, ext)
    datasetToggle(myMap, datasets, pk, ext, url, layerMod)
  })
})

