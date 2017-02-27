// this is the portal view specific javascript

/*
This file is going to need to be refactored so that it can deal with the
marker cluster functions and so that it can be used to change the colors
and shapes of the dataset points, lines, and polygons
*/

// This file has all the basic map stuff, if there are specific functions
// for specific pages they will be in their own javascript files
// writen with ES6
// One thing I should do is to create a special ZMT icon with a ZMT popup that
// looks cool.
// should everything be wrapped in a dom ready function? At least I can
// use it instead of the jQuery function
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
// I have no idea why I have to use the "new" keyword here, so i'm taking it
// out
const myMap = L.map('mapid', {
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

const baseLayerControl = L.control.layers(baseLayers)
baseLayerControl.addTo(myMap)

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

// I am going to bring the base_map javascript into this file, just like the
// javascript for the detailView

// Get list of dataset checkbox items and the length of the list
// and make empty array to push datasets to

/*
All I have to do is make a list of urls that omnivore, or whatever else, can
make calls to. The urls just have to be in the form "load_dataset/#/" where
the # is the primary key for the dataset. This will call a django view
that is programmed to make a request to the actual dataset url with any
auth and password information the actual url needs.
*/

// setting up the markercluster stuff

// define markercluster group that filteredLayer can be added to
// and add it to the map
// add allMarkers to myMap
// should these groups just be added to the 'datasets' dictionary instead of
// the 'layer item?'

const makeGroup = (color) => {
  return new L.MarkerClusterGroup({
    iconCreateFunction: (cluster) => {
      return new L.DivIcon({
        iconSize: [20, 20],
        html: `<div style="text-align:center;color:#fff;background: ${color}
        ${cluster.getChildCount()}</div>`
      })
    }
  })
}


// get the list of datasets provided by django
const datasetCheckboxes = document.getElementsByName('datasetCheckbox')

// make empty dictionary object that I can add layers to as key: value pairs
// with the dataset primary key being the key and the layer being the value
const datasets = {}

// set colors to add to the points
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
let colorCounter = 0

// how do I functionalize this?
// add event listeners to each of the checkboxes on the html page
datasetCheckboxes.forEach((cb) => {
  // increment colors
  colorCounter++
  const color = colors[colorCounter % colors.length]
  cb.addEventListener('click', (e) => {
    const value = e.target.value
    const ext = e.target.id
    datasetToggle(value, ext, color)
  })
  // change the element's color to it's map layer color
  // cb.style.backgroundColor = color
})

// create popups function
const addPopups = (layer) => {
  const popupContent = []
  // How can I functionalize this block
  for (const key in layer.feature.properties) {
    popupContent.push(
      `<b>${key}</b>: ${layer.feature.properties[key]}`
    )
  }
  // How can I functionalize this block
  if (layer.feature.geometry.type === 'Point') {
    popupContent.push(`<b>Latitude:</b>
    ${layer.feature.geometry.coordinates[1]}`)
    popupContent.push(`<b>Longitude:</b>
    ${layer.feature.geometry.coordinates[0]}`)
  }
  // How can I functionalize this block
  layer.bindPopup(popupContent.join('<br/>'))
}

// create function that sets the color marker's options (for point datasets)
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

const datasetToggle = (value, ext, color) => {
  const datasetUrl = `/load_dataset/${value}` // supposed to be a function?
  let layer

  // How can I functionalize this block -- I could turn the if/else into a
  // function
  // check to see if the map already has the layer
  if (myMap.hasLayer(datasets[value])) {
    myMap.removeLayer(datasets[value])
  } else {
    // set up custom color selector layer/function
    const layerColor = L.geoJson(null, {
      // do this for points
      pointToLayer: (feature, latlng) => {
        // return L.circleMarker(latlng, colorMarkerOptions)
        return L.circleMarker(latlng, setColorMarkerOptions(color))
      },
      // do this for everything else
      onEachFeature: (feature, layer) => {
        layer.options.color = color
      }
    })

    if (ext === 'kml') {
      layer = omnivore.kml(datasetUrl, null, layerColor)
        .on('ready', () => {
          myMap.fitBounds(layer.getBounds())
          myMap.addLayer(layer)
          layer.eachLayer(addPopups)
        })
    } else if (ext === 'csv') {
      layer = omnivore.csv(datasetUrl, null, layerColor)
        .on('ready', () => {
          myMap.fitBounds(layer.getBounds())
          myMap.addLayer(layer)
          layer.eachLayer(addPopups)
        })
    } else {
      layer = omnivore.geojson(datasetUrl, null, layerColor)
        .on('ready', () => {
          myMap.fitBounds(layer.getBounds())
          myMap.addLayer(layer)
          layer.eachLayer(addPopups)
        })
    }
    datasets[value] = layer
  }
}
