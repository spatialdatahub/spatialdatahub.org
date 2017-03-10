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

// ////////////////////////////////////////////////////////////////////////////
/*
// PAGE SPECIFIC FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////


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

const breadcrumbContainer = document.getElementById('breadcrumbContainer')

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

  const linkParent = link.parentElement

  // one more thing I have to do is append the dataset to the bread crumbs on click
  // sorta hacky...
  const dsText = link.textContent
  const dsUrl = link.getAttribute('url')
  const breadcrumb = `<a href="${dsUrl}">${dsText}</a>`

  link.addEventListener('click', () => {
    classToggle(linkParent, 'active')

    // (url, ext, map, obj, key, modJson, func)
    // this is proving difficult to putinto a function, so i'm jsut writing it here
    // datasetToggle(myMap, datasets, pk)
    datasets[pk]
      ? myMap.hasLayer(datasets[pk])
        ? myMap.removeLayer(datasets[pk]) 
        : myMap.addLayer(datasets[pk]).fitBounds(datasets[pk].getBounds())
      // if there is no datasets[pk] then go through the process of selecting
      // the right omnivore function and getting the data and stuff
      : extSelect(ext, url) // the promise
        .then(response => {
          layerMod.addData(response.toGeoJSON()) // modify the layer 
          myMap.addLayer(layerMod).fitBounds(layerMod.getBounds())
          addDataToContainer(layerMod, datasets, pk)
        }, error => {
          console.log(error)
        })

    // append breadcrumbs links to breadcrumbs thing on click
    breadcrumbContainer.innerHTML = breadcrumb
  })
})

