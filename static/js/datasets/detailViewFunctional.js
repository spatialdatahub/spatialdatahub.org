// ////////////////////////////////////////////////////////////////////////////
/*
// Define Constants
*/
// ////////////////////////////////////////////////////////////////////////////

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

// set up map, view and base layer
const myMap = new L.Map('mapid', {
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

const circleOptions = {
  radius: 8,
  fillColor: '#ee74f7',
  color: 'green',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.7
}

// Constant values
const value = document.getElementById('dataset_pk').getAttribute('value')
const datasetUrl = `/load_dataset/${value}`
const ext = document.getElementById('dataset_ext').getAttribute('value')

// Text input elements
const lngMinInput = document.getElementById('lng_min_input')
const lngMaxInput = document.getElementById('lng_max_input')
const latMinInput = document.getElementById('lat_min_input')
const latMaxInput = document.getElementById('lat_max_input')

// Button elements
const submitValuesButton = document.getElementById('submit_values_button')

// ////////////////////////////////////////////////////////////////////////////
/*
// Define Functions
*/
// ////////////////////////////////////////////////////////////////////////////

// Do function stuff
// Control button creation -- eventually this will need to be written better
L.Control.Watermark = L.Control.extend({
  onAdd: (map) => {
    const img = L.DomUtil.create('img')
    // this will have to be changed relative to the site for production
    img.src = 'http://localhost:8000/static/images/zmt_logo_blue_black' +
      '_100px.png'
    img.style.width = '100px'
    return img
  },
  onRemove: (map) => {
    // Nothing to do here
  }
})

L.Control.HomeButton = L.Control.extend({
  onAdd: (map) => {
    const container = L.DomUtil.create('div',
      'leaflet-bar leaflet-control leaflet-control-custom')
    //  container.innerHTML = '<i class="fa fa-home fa-2x" aria-hidden="true"></i>'
    container.style.backgroundImage = 'url("http://localhost:8000/static/images/home_icon.png")'
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

L.Control.ToggleScrollButton = L.Control.extend({
  onAdd: (map) => {
    const container = L.DomUtil.create('div',
      'leaflet-bar leaflet-control leaflet-control-custom')
    container.style.backgroundImage = 'url("http://localhost:8000/static/images/mouse.png")'
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

// Can I separate XMLHttpRequest calls, Promises, and if/else statements?
// Start by separating the kml / csv / json XMLHttpRequests.
// function to get data from geojson dataset with a promise
// Can I do this without using all the promise logic in here?

// I hate repeating code, i've already had issues with errors because of it

// JSON
const getJSONDataset = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => {
      xhr.readyState === 4 && xhr.status === 200
        ? resolve(JSON.parse(xhr.responseText)) : reject(Error(xhr.statusText))
    }
    xhr.onerror = () => reject(Error('Network Error - JSON'))
    xhr.send()
  })
  return promise
}

// KML
const getKMLDataset = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    // The next few lines are different than the getJSONDataset and getCSVDataset
    // calls from here
    xhr.responseType = 'document'
    xhr.overrideMimeType('text/xml')
    xhr.onload = () => {
      xhr.readyState === 4 && xhr.status === 200
        ? resolve(toGeoJSON.kml(xhr.response)) : reject(Error(xhr.statusText))
    }
    // to here
    xhr.onerror = () => reject(Error('Network Error - KML'))
    xhr.send()
  })
  return promise
}

// CSV
const getCSVDataset = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => {
      xhr.readyState === 4 && xhr.status === 200
        ? csv2geojson.csv2geojson(
            xhr.responseText, (err, data) => {
              err ? reject(Error(err)) : resolve(data)
            }
          )
        : reject(Error(xhr.statusText))
    }
    xhr.onerror = () => reject(Error('Network Error - CSV'))
    xhr.send()
  })
  return promise
}

// I don't really like the little html droplets, so I'm going to make all
// points into little circle markers. This is the function for that.
const makeCircles = (feature, latlng) => L.circleMarker(latlng, circleOptions)

// function to run through feature and layer once and count

// function to count dataset features

// Since I was having trouble with the .map feature, I decided to use the
// .forEach feature to add data to the popupContent array
const onReadyPopups = (feature, layer) => {
  // empty array to contain popup content
  const popupContent = []
  // run through feature properties, if there are any and add them to array
  feature.properties.length !== undefined || feature.properties.length !== 0
    ? Object.keys(feature.properties).forEach(key => {
      popupContent.push(`<b>${key}</b>: ${feature.properties[key]}`)
    }) : console.log('No feature properties')
  // push coordinates to array, if the feature is of the type point
  feature.geometry.type === 'Point'
    ? popupContent.push(
        `<b>Latitude:</b> ${feature.geometry.coordinates[1]}`,
        `<b>Longitude:</b> ${feature.geometry.coordinates[0]}`
    ) : console.log(feature.geometry.type)
  layer.bindPopup(popupContent.join('<br/>'))
}

// I need to make a function or something that takes the ext and calls the
// correct getData function

// build filtering select function
// start with clearLayers
/*
const filterValues = (layer, cluster, minLng, maxLng, minLat, maxLat) => {
  layer.clearlayers()
  cluster.removeLayer(layer)

  // these have to be values taken from the inputs
  minLng = 0
  maxLng = 180
  minLat = -90
  maxLat = 90
}
*/
const getInputValue = (element) => console.log(element.value)

const filterValues = (feature, layer, minLng, maxLng, minLat, maxLat) => {
  /*
  minLng = 0
  maxLng = 180
  minLat = -90
  maxLat = 90
  */
  const coords = feature.geometry.coordinates
  const filteredData = coords[0] > minLng &&
                       coords[0] < maxLng &&
                       coords[1] > minLat &&
                       coords[1] < maxLat
  return filteredData
}


// ////////////////////////////////////////////////////////////////////////////
/*
// Implement Functions
*/
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////
// Special Interlude - Make constants that require functions to be created

// It looks like 'onEachFeature' can be called more than once
const filteredLayer = L.geoJson(null, {
  filter: filterValues,
  onEachFeature: onReadyPopups,
  pointToLayer: makeCircles
})

const allMarkers = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 50
})
// ////////////////////////////////////////////////////////////////////////////

// Implement functions
// this one is sorta not in the right style
L.control.layers(baseLayers).addTo(myMap)

L.control.watermark = (options) => new L.Control.Watermark(options)
L.control.watermark({position: 'bottomleft'}).addTo(myMap)

L.control.homebutton = (options) => new L.Control.HomeButton(options)
L.control.homebutton({position: 'topleft'}).addTo(myMap)

L.control.togglescrollbutton = (options) => new L.Control.ToggleScrollButton(options)
L.control.togglescrollbutton({position: 'topleft'}).addTo(myMap)

// Add filteredLayer to the marker cluster stuff, then add the markercluster
// group to the map
// allMarkers.addLayer(filteredLayer)
myMap.addLayer(allMarkers)

// make sure filteredLayer is added to the map
// I might have to create the filteredLayer with options here
// now every time a layer is added to the filteredLayer it automatically adds
// the popupContent and stuff
// Function that calls correct get___Dataset function based on ext
// this should be written differently

// I need to set this up as a function that returns a function, then the
// rest of the . notation stuff can be used, I think
ext === 'kml'
  ? getKMLDataset(datasetUrl)
    .then(data => {
      filteredLayer.addData(data)
      allMarkers.addLayer(filteredLayer)
    }, error => console.log(error))
: ext === 'csv'
  ? getCSVDataset(datasetUrl)
    .then(data => {
      filteredLayer.addData(data)
      allMarkers.addLayer(filteredLayer)
    }, error => console.log(error))
  : getJSONDataset(datasetUrl)
    .then(data => {
      filteredLayer.addData(data)
      allMarkers.addLayer(filteredLayer)
    }, error => console.log(error))

// ////////////////////////////////////////////////////////////////////////////
// Special Interlude - Add Event Listeners function calls

submitValuesButton.addEventListener("click",
  (
    getInputValue(lngMinInput),
    getInputValue(lngMaxInput),
    getInputValue(latMinInput),
    getInputValue(latMaxInput)) => {

//  filterValues(filteredLayer, allMarkers, -180, 180, -90, 90)
})

// ////////////////////////////////////////////////////////////////////////////
