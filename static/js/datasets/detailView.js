// ////////////////////////////////////////////////////////////////////////////
/*
// PAGE SPECIFIC FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////

const dataset = []
const pk = document.getElementById('dataset_pk').getAttribute('value')
const ext = document.getElementById('dataset_ext').getAttribute('value')

// there must be a better way to do this... but for now it works
// it should be turned into a function and used here and in the portalView
let url
document.getElementById('auth')
  ? url = `/load_dataset/${pk}`
  : url = document.getElementById('dataset_url').getAttribute('value')

const color = 'red' // I'm going to make a color selector element, and take the value

const featureCountElement = document.getElementById('feature_count')

// pointMarkerOptions
const markerOptions = {
  radius: 6,
  color: color,
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
}

// make a L.geoJSON object that can be used to filter the data
const filteredLayer = L.geoJSON(null, {
  // filter: filterValues, // this should be a function...
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

// get the dataset, add it to the map as a layer, and add the
// geojson to the dataset array
// could I just pass the dataset and object in here, instead
// of in the index.js page?
// or could i just put this on the index page and do it there?

const fc = obj => {
  featureCountElement.innerHTML = Object.keys(obj._layers).length
}

// Select correct function with the extension, then get the data
// with a promise. Then add the data to the modified layer as geoJson,
// then add the modified layer to the map and get its bounds
// then call any other functions that should be run when the page is loaded

extSelect(ext, url)
  .then(response => {
    dataset.push(response.toGeoJSON()) // add data to empty dataset array
    filteredLayer.addData(response.toGeoJSON()) // add data to filter layer
    myMap.addLayer(filteredLayer)
      .fitBounds(filteredLayer.getBounds()) // add filter layer to map
    fc(filteredLayer) // get the number of features and add it to the feature count div
  }, error => console.log(error))

// Time to add turf
// first get points for polygon
const submitValuesButton = document.getElementById('submit_values_button')

const minLatInput = document.getElementById('min_lat_input')
const maxLatInput = document.getElementById('max_lat_input')
const minLngInput = document.getElementById('min_lng_input')
const maxLngInput = document.getElementById('max_lng_input')

// add event listener to submit button
submitValuesButton.addEventListener('click', () => {
  // get values for (square) polygon
  minLat = minLatInput.value
  maxLat = maxLatInput.value
  minLng = minLngInput.value
  maxLng = maxLngInput.value

  // make default values for inputs

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

  // make polygon and add it to a feature collection
  // - values for lng are not working. try something else

  const poly = turf.featureCollection([
    turf.polygon([[
      [minLng, maxLat], // same as end
      [maxLng, maxLat],
      [maxLng, minLat],
      [minLng, minLat],
      [minLng, maxLat] // same as beginning
    ]])
  ])

/*
var features = [
  turf.point([minLng, maxLat]),
  turf.point([maxLng, maxLat]),
  turf.point([maxLng, minLat]),
  turf.point([minLng, minLat])
]

var poly = turf.featureCollection(features)
*/

console.log(poly)

/*
  // make polygon with
  const poly = turf.polygon([[
      [-50, 50], // same as end
      [50, 50],
      [50, -50],
      [-50, -50],
      [-50, 50] // same as beginning
    ]])
*/

  L.geoJSON(poly).addTo(myMap)

  // clear filteredLayer
  filteredLayer.clearLayers()

  // get data within polygon
  const ds = dataset[0]
  const withinData = turf.within(ds, poly)

  console.log(withinData)

  // add data to filtered Layer
  filteredLayer.addData(withinData)
})
