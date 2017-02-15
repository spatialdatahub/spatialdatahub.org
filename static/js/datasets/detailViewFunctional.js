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

// Empty container to be filled with data from XMLHttpRequest
const dataset = []

// Text input elements
const minLngInput = document.getElementById('min_lng_input')
const maxLngInput = document.getElementById('max_lng_input')
const minLatInput = document.getElementById('min_lat_input')
const maxLatInput = document.getElementById('max_lat_input')

const propertySelector = document.getElementById('property_selector')
const propertySelectorInput = document.getElementById('property_selector_input')

// Display elements
const featureCountElement = document.getElementById('feature_count')

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

// test whether I need promise to be wrapped in a function
// I do need the url... so

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

const getInputValue = (element) => element.value

// check longitude and latitude values
const checkVal = (val, defaultVal, minVal, maxVal) => {
  val = typeof val === 'undefined' ? defaultVal
    : val === '' ? defaultVal
    : val < minVal ? minVal
    : val > maxVal ? maxVal
    : val
  return val
}

const filterLatLngValues = (feature, layer, minLng, maxLng, minLat, maxLat) => {
  // set default values for minimum and maximum lat and lng, incase no
  // values are passed through
  minLng = checkVal(getInputValue(minLngInput), -180, -180, 180)
  maxLng = checkVal(getInputValue(maxLngInput), 180, -180, 180)
  minLat = checkVal(getInputValue(minLatInput), -90, -90, 90)
  maxLat = checkVal(getInputValue(maxLatInput), 90, -90, 90)

  const coords = feature.geometry.coordinates
  const filteredData = coords[0] > minLng &&
                       coords[0] < maxLng &&
                       coords[1] > minLat &&
                       coords[1] < maxLat
  return filteredData
}

const filterFeaturePropertyValues = (feature, layer, featureProperty) => {
  // get the property and the input value
  const selectedProperty = getInputValue(propertySelector)
  const propertyValue = getInputValue(propertySelectorInput)

  const prop = feature.properties[`${selectedProperty}`]
  const filteredData = typeof prop === 'string'
    ? prop.toLowerCase().includes(propertyValue.toLowerCase())
    : typeof(prop) === 'number' ? prop === Number(propertyValue)
    : console.log('only strings or numbers')
  return filteredData
}

const buildFeaturePropertiesSelector = data => {
  // get keys for feature properties for first element dataset and add to array
  const featureKeys = Object.keys(dataset[0].features[0].properties)
    .map(key => key)

  // create elements
  const ifFeaturesElement = document.getElementById('if_features')
  const p = document.createElement('p')
  const span = document.createElement('span')
  const b = document.createElement('b')
  const text = document.createTextNode('Select property to filter by: ')
  const selector = document.createElement('select')
  const input = document.createElement('input')

  // set id of p and select elements
  p.setAttribute('id', 'selector_container')
  selector.setAttribute('id', 'property_selector')
  input.setAttribute('id', 'property_selector_input')
  input.setAttribute('type', 'text')

  // put them all together
  b.appendChild(text)
  span.appendChild(b)
  span.appendChild(selector)
  span.appendChild(input)
  p.appendChild(span)
  ifFeaturesElement.appendChild(p)

  // create and add options to the feature selector element
  featureKeys.forEach(i => {
    const opt = document.createElement('option')
    opt.value = i
    opt.innerHTML = i
    selector.appendChild(opt)
  })
}

const onDatasetImport = data => {
  // make sure that original data are saved somewhere
  dataset.push(data)

  // get keys for feature properties for first element dataset and add to array
  Object.keys(dataset[0].features[0].properties).length > 0
    ? buildFeaturePropertiesSelector(dataset)
    : console.log('No feature properties to filter')

  // add dataset to the filteredLayer and filteredLayer to allMarkers
  filteredLayer.addData(dataset)
  allMarkers.addLayer(filteredLayer)

  // get count of features in filteredLayer
  const featureCount = Object.keys(filteredLayer._layers).length
  featureCountElement.innerHTML = ` ${featureCount}`
}

// ////////////////////////////////////////////////////////////////////////////
/*
// Implement Functions
*/
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////
// Special Interlude - Make constants that require functions to be created

// It looks like 'onEachFeature' can be called more than once
// It also looks like I need to check if the dataset is a points type or not
// how do I pass values to the filter function?
const filteredLayer = L.geoJson(null, {
  filter: () => {
    filterLatLngValues
    if (propertySelectorInput !== 'undefined') {
      getInputValue(propertySelectorInput) !== ''
        ? filterFeaturePropertyValues
        : console.log('lat lng')
    }
  },
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
// This should only work for points datasets
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
    .then(onDatasetImport, error => console.log(error))
: ext === 'csv'
  ? getCSVDataset(datasetUrl)
    .then(onDatasetImport, error => console.log(error))
  : getJSONDataset(datasetUrl)
    .then(onDatasetImport, error => console.log(error))

// ////////////////////////////////////////////////////////////////////////////
// Add Event Listeners for function calls

// submit button:
// clearLayers in filteredLayer
// remove filteredLayer from allMarkers
// add data to filteredLayer -- and hopefully the data are filtered
// add filteredLayer to allMarkers

submitValuesButton.addEventListener('click', () => {
  filteredLayer.clearLayers()
  allMarkers.clearLayers()
  filteredLayer.addData(dataset)
  allMarkers.addLayer(filteredLayer)
  const featureCount = Object.keys(filteredLayer._layers).length
  featureCountElement.innerHTML = ` ${featureCount}`
})

// ////////////////////////////////////////////////////////////////////////////
