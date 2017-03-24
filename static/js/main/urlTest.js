// ////////////////////////////////////////////////////////////////////////////
/*
// URLTEST SPECIFIC FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////
// get input text element and submit button
const urlInput = document.getElementById('url_input')
const urlButton = document.getElementById('url_button')
const toggleAllButton = document.getElementById('toggle_all')
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

// add event listener to the button
urlButton.addEventListener('click', () => {
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
      addButton(count, color, buttons).addEventListener('click', function () {
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

// this needs to be added to indexMap.js, and tested
const toggleAll = (obj, map) => {
  // make array
  const array = []

  // push values to array
  Object.keys(obj).forEach(key => array.push(obj[key]))

  // check if map has any of the layers
    // if true, remove layers
    // if false, add all layers
  const tf = []
  array.forEach(ds => {
    map.hasLayer(ds)
      ? tf[0] = true
      : console.log('nope')
  })

  // if tf is true, remove all layers, otherwise add them all
  tf[0] === true
    ? array.forEach(ds => map.removeLayer(ds))
    : array.forEach(ds => map.addLayer(ds))
}

toggleAllButton.addEventListener('click', () => {
  toggleAll(datasets, myMap)
})
