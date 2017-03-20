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

// make function that gets the ext of the url
const getExt = url => {
  const ext = {}
  url.toLowerCase()
  url.endsWith('kml')
    ? ext[0] = 'kml'
    : url.endsWith('csv')
      ? ext[0] = 'csv'
      : url.endsWith('json')
        ? ext[0] = 'geojson'
        : console.log(url)
  return ext[0]
}

// get input text element and submit button
const urlInput = document.getElementById('url_input')
const urlButton= document.getElementById('url_button')

// add event listener to the button
urlButton.addEventListener('click', () =>{ 
  const ext = getExt(urlInput.value)
  const url = urlInput.value
  extSelect(ext, url)
    .then(response => {
      myMap.addLayer(response)
    }, error => console.log(error))
})

// url.endsWith('json') ? ext = 'geojson' : console.log('url')

/*
extSelect(ext, url)
  .then(response => {
    filteredLayer.addData(response.toGeoJSON()) // add data to filter layer
    myMap.addLayer(filteredLayer)
      .fitBounds(filteredLayer.getBounds()) // add filter layer to map
  }, error => console.log(error))
*/
