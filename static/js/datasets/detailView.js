// How hard would it be to write this in functional programming style?
// If I were to do that would it be easier to deal with later? Would it
// be worth the effort?

// I just need to reorganize all this stuff

// This file has all the basic map stuff, if there are specific functions
// for specific pages they will be in their own javascript files
// writen with ES6
// One thing I should do is to create a special ZMT icon with a ZMT
// popup that looks cool.
// should everything be wrapped in a dom ready function? At least I can use
// it instead of the jQuery function
// create base tile layer variables for map
// I am setting three as constants here

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

// create layer group and add base tile layers, then add it to the map
const baseLayers = {
  'Open Street Maps': osm,
  'Black and White': stamenToner,
  'ESRI World Map': esriWorldImagery
}

const baseLayerControl = L.control.layers(baseLayers).addTo(myMap)
//baseLayerControl.addTo(myMap)

// toggle map scrollability
const scrollWheelToggle = () => {
  if (myMap.scrollWheelZoom.enabled()) {
    myMap.scrollWheelZoom.disable()
    console.log('no scroll!')
  } else {
    myMap.scrollWheelZoom.enable()
    console.log('scroll away!')
  }
}

myMap.on('click', scrollWheelToggle)

// below is the javascript file specific to the map detail view
// I am going to include all the javascript here... as in I will not try to
// inheret javascript from former files. It goes against the 'DRY' style
// of writing code, but it puts everything here for me, right now.

///////////////////////////////////////////////////////////////////////////////
/*
  I need to add a custom home button control

  I need to fix this whole document so that it is written in the functional
  programming style

  I need to have tests for everything
*/
///////////////////////////////////////////////////////////////////////////////
// Going to test something out
/*
L.Control.Home = L.Control.extend({

  onAdd: (map) => {
    const container = L.DomUtil.create('div',
      'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';
    container.style.width = '33px';
    container.style.height = '33px';
    container.style.zIndex = 100000;

    container.onclick = () => {
      map.setView({'lat': 0, 'lng': 0}, 2);
      console.log('buttonClicked');
    }
    return container;
  },

  onRemove: (map) => {

  }
})

L.control.search = (options) => { new L.Control.Home(options) }

L.control.search({ position: "topright" }).addTo(myMap)
*/
// EXAMPLE Control Extension:
L.Control.Watermark = L.Control.extend({
    onAdd: (map) => {
        var img = L.DomUtil.create('img');

        img.src = 'http://coresymposium.zmt-bremen.com/wp-content/uploads/' +
                  '2015/02/zmt_logo_blue_and_white-300x146.png';
        img.style.width = '100px';

        return img;
    },

    onRemove: (map) => {
        // Nothing to do here
    }
});

L.control.watermark = (options) => {
    return new L.Control.Watermark(options);
}

L.control.watermark({ position: 'bottomleft' }).addTo(myMap);

// Define my variables

const value = document.getElementById('dataset_pk').getAttribute('value')
const ext = document.getElementById('dataset_ext').getAttribute('value')
const submitValuesButton = document.getElementById('submit_values_button')
const resetValuesButton = document.getElementById('reset_values_button')
const lngMinInput = document.getElementById('lng_min_input')
const lngMaxInput = document.getElementById('lng_max_input')
const latMinInput = document.getElementById('lat_min_input')
const latMaxInput = document.getElementById('lat_max_input')
const featureCountElement = document.getElementById('feature_count')
const datasetUrl = `/load_dataset/${value}`

let dataset
let featureCount = 0
let datasetProperties = []

// define geojson layer that the dataset may be added to
let filteredLayer = L.geoJson()

// define markercluster group that filteredLayer can be added to
// and add it to the map
let allMarkers = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 50
})

// add filteredLayer to allMarkers
allMarkers.addLayer(filteredLayer)
myMap.addLayer(allMarkers)

// define my popups function
const onReadyPopups = () => {
  featureCount = 0
  filteredLayer.eachLayer(layer => {
    featureCount++
    const popupContent = []

    // make sure there are properties
    if (
      layer.feature.properties.length !== undefined ||
      layer.feature.properties.length !== 0) {
      for (const key in layer.feature.properties) {
        popupContent.push(
          `<b>${key}</b>: ${layer.feature.properties[key]}`
        )
        // get keys and put them into keys variable
        datasetProperties.push(`${key}`)
      }
    }

    if (layer.feature.geometry.type === 'Point') {
      popupContent.push(`<b>Latitude:</b>
        ${layer.feature.geometry.coordinates[1]}`)
      popupContent.push(`<b>Longitude:</b>
        ${layer.feature.geometry.coordinates[0]}`)
    }
    layer.bindPopup(popupContent.join('<br/>'))
  })

  // fit map to bounds
  const bounds = filteredLayer.getBounds()
  myMap.fitBounds(bounds)

  if (datasetProperties.length > 0) {
    // get unique dataset properties
    const uniqueDatasetProperties = [...new Set(datasetProperties)]

    const ifFeatureProperties = () => {
      // remove if they are there elements, then create elements
      if (document.getElementById('selector_container')) {
        document.getElementById('selector_container').remove()
      }

      // create elements
      const ifFeaturesElement = document.getElementById('if_features')
      const p = document.createElement('p')
      const span = document.createElement('span')
      const b = document.createElement('b')
      const text = document.createTextNode('Select property to filter by: ')
      const selector = document.createElement('select')
      const input = document.createElement('input')

      // set id of p and select element
      p.setAttribute('id', 'selector_container')
      selector.setAttribute('id', 'property_selector')
      input.setAttribute('id', 'property_selector_input')
      input.setAttribute('type', 'text')

      // put them together
      b.appendChild(text)
      span.appendChild(b)
      span.appendChild(selector)
      span.appendChild(input)
      p.appendChild(span)
      ifFeaturesElement.appendChild(p)

      // add options to select element

      // delete options in the featureSelector element
      for (const i in selector) {
        selector.options[i] = null
      }

      // create and add options to the feature selector element
      for (const i in uniqueDatasetProperties) {
        const opt = document.createElement('option')
        opt.value = uniqueDatasetProperties[i]
        opt.innerHTML = uniqueDatasetProperties[i]
        selector.appendChild(opt)
      }
    }
    ifFeatureProperties() // this should be 'if feature properties'
  }

  // count features and add them to 'feature count html element'
  featureCountElement.innerHTML = ` ${featureCount}`
}

// would it be better to write an if/else statement within this function
// that checks the ext variable, or to write three functions and an if / else
// statement that selects which function to use?
// what would be easier to test? What would be easier to write? What would be
// easier to debug?

// I'm going with three functions and an if / else statement
// that actually modifies which functions are even defined.

const getDataset = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)

    if (ext === 'kml') {
      xhr.responseType = 'document'
      xhr.overrideMimeType('text/xml')
    }

    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
      // Maybe I should just define the if/else statement right here
        if (ext === 'csv') {
          let csvJson
          csv2geojson.csv2geojson(
            xhr.responseText, function (err, data) {
              if (err) {
                return err
              } else {
                csvJson = data
                return csvJson
              }
            })
          resolve(csvJson) // CSV
        } else if (ext === 'kml') {
          const kmlJson = toGeoJSON.kml(xhr.response)
          resolve(kmlJson) // KML
        } else {
          resolve(JSON.parse(xhr.responseText)) // JSON
        }
      } else {
        reject(Error(xhr.statusText))
      }
    }
    xhr.onerror = () => reject(Error('Network Error'))
    xhr.send()
  })
  return promise
}

console.log(ext)

// I don't want to add another if / else statement, but I think i may have to
// so that I can deal with the kml and csv stuff, except that I don't want
// a layer, I want a json object

const addDatasetToMapJSON = () => {
  getDataset(datasetUrl)
    .then((response) => {
      dataset = response // this should work after kml has been
                         // converted to geojson

      filteredLayer.addData(dataset)
      allMarkers.addLayer(filteredLayer)
    })
    .then((response) => {
      onReadyPopups(response)
    }, (error) => {
      console.log('promise error handler', error)
    })
}

// Now I've got to figure out what the url and necessary DOM elements are
// all called.
// I think that the filterValues and filterPropertyValues functions
// may have to be combined.
const filterValues = () => {
  // remove filteredLayer
  allMarkers.removeLayer(filteredLayer)

  // get the property and the input values
  const selectedProperty = document.getElementById('property_selector')
    .value
  const propertyValue = document.getElementById('property_selector_input')
    .value

  // get min and max values from lat and lng inputs
  // can I lift this out of the function, and just get the values
  // for each?
  let minLng = lngMinInput.value
  let maxLng = lngMaxInput.value
  let minLat = latMinInput.value
  let maxLat = latMaxInput.value

  // if else statements. There should be a better way to do this.
  // the problem is that there are different default values for each
  // of the lat/lng options
  if (minLng === '') {
    minLng = -180
  } else if (minLng <= -180) {
    minLng = -180
  } else if (minLng >= 180) {
    minLng = 180
  }

  if (maxLng === '') {
    maxLng = 180
  } else if (maxLng <= -180) {
    maxLng = -180
  } else if (maxLng >= 180) {
    maxLng = 180
  }

  if (minLat === '') {
    minLat = -90
  } else if (minLat <= -90) {
    minLat = -90
  } else if (minLat >= 90) {
    minLat = 90
  }

  if (maxLat === '') {
    maxLat = 90
  } else if (maxLat <= -90) {
    maxLat = -90
  } else if (maxLat >= 90) {
    maxLat = 90
  }

  // remake filtered layer with new min and max values
  filteredLayer = L.geoJson(dataset, {
    filter: (feature, layer) => {
      const coords = feature.geometry.coordinates
      // check if the property filter input is empty or not
      if (propertyValue === '') {
        let filteredData = coords[0] > minLng &&
                           coords[0] < maxLng &&
                           coords[1] > minLat &&
                           coords[1] < maxLat
        return filteredData
      } else {
        let prop = feature.properties[`${selectedProperty}`]
        let propBool

        // check to see what type of object the map.feature.property is
        if (typeof (prop) === 'string') {
          propBool = prop.toLowerCase().includes(propertyValue.toLowerCase())
        } else if (typeof (prop) === 'number') {
          propBool = prop === Number(propertyValue)
        } else {
          console.log('only strings or numbers')
        }

        // each of these things evalutes to either true or false, if any
        // one of them is false the point will be filtered out
        let filteredData = coords[0] > minLng &&
                           coords[0] < maxLng &&
                           coords[1] > minLat &&
                           coords[1] < maxLat &&
                           propBool
        return filteredData
      }
    }
  })
  allMarkers.addLayer(filteredLayer)
}

const resetValues = () => {
  // remove filteredLayer
  allMarkers.removeLayer(filteredLayer)

  // set filteredLayer to unfiltered dataset
  filteredLayer = L.geoJson(dataset)
  allMarkers.addLayer(filteredLayer)

  // clear lat and long min and max input values
  lngMinInput.value = ''
  lngMaxInput.value = ''
  latMinInput.value = ''
  latMaxInput.value = ''
}

// add event listener to submitValuesButton
submitValuesButton.addEventListener('click', () => {
  filterValues()
  onReadyPopups()
})

// add event listener to resetValuesButton
resetValuesButton.addEventListener('click', () => {
  resetValues()
  onReadyPopups()
})

// call the function that adds data to the map
// should the switch function for JSON / XML / CSV be here?
addDatasetToMapJSON()
