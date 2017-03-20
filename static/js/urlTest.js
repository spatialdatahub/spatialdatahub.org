// These first so many lines should be in their own file, I keep rewriting them
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
// get input text element and submit button
const urlInput = document.getElementById('url_input')
const urlButton = document.getElementById('url_button')
const buttons = document.getElementById('buttons')
const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red']

// make container for the datasets 
const datasets = {}
let count = 0

// pointMarkerOptions
const markerOptions = {
  radius: 6,
  color: 'black',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
}

// set up layer to add data to



// make function that gets the ext of the url
// it can handle csv, kml, json, and geojson
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

// make function for adding buttons
const addButton = (n, color, container) => {
  const btn = document.createElement('button') 
  const value = document.createTextNode(n)
  btn.setAttribute('class', 'btn btn-default active')
  btn.setAttribute('value', n)

  // make the color of the number correspond
  // to the color of the dataset on the map
  btn.style.color = color
  btn.style.fontWeight = 'bold' 

  // add text to button and button to div
  btn.appendChild(value)
  container.appendChild(btn)

  return btn
}



// add event listener to the button
urlButton.addEventListener('click', () =>{ 
  const ext = getExt(urlInput.value)
  const url = urlInput.value


  // increment count and color
  count++
  const color = colors[count % colors.length]



  // should these things be in the extSelect call?
  // get dataset, save it to datasets container, and add it to map
  extSelect(ext, url)
    .then(response => {

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



      // if response is good, add a button for it
      addButton(count, color, buttons).addEventListener('click', function() {
        classToggle(this, 'active')
        const val = this.getAttribute('value')
        myMap.hasLayer(datasets[val])
        ? myMap.removeLayer(datasets[val])
        : myMap.addLayer(datasets[val])
      })

      // modify data here
      layerMod.addData(response.toGeoJSON())

      datasets[count] = layerMod
      myMap.addLayer(layerMod)
        .fitBounds(layerMod.getBounds())
    }, error => console.log(error))
  
})




// add new colored button to buttons div
