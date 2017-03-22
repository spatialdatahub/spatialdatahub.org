// ////////////////////////////////////////////////////////////////////////////
/*
// URLTEST SPECIFIC FUNCTIONS
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

