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

// to toggle active datasets on the map, and otherwise I need the list of datasets 
// should this be a const?
const datasetLinks = document.getElementsByName('dataset')
const datasets = {}

// color marker options
const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red']
let colorCounter = 0
const setColorMarkerOptions = (color) => {
  const colorMarkerOptions = {
    radius: 8,
    fillColor: color,
    color: 'black',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.4
  }
  return colorMarkerOptions
}

// add event that toggles the link's class from active to not
// 
datasetLinks.forEach(link => {
  const ext = link.getAttribute('id')
  const pk = link.getAttribute('value')
  const url = `/load_dataset/${pk}`

  // deal with colors
  colorCounter++
  const color = colors[colorCounter % colors.length]
  console.log(color)

  // I have to put the modJson in here. If I don't do that then every dataset will be
  // added to the modJson L.geoJson layer, resulting in one monstrous layer.
  // Every time I call the 'getDataset' function there needs to be a new modJson called
  const layerMod = L.geoJson(null, {
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, setColorMarkerOptions(color))
    },
    onEachFeature: addPopups
  })

  link.addEventListener('click', () => {
    classToggle(link, 'active')
    // (map, obj, key, url, ext)
    datasetToggle(myMap, datasets, pk, ext, url, layerMod)
  })
})

// my own function (scrollWheelToggle), sitting in index.js
myMap.on('click', () => scrollWheelToggle(myMap))


