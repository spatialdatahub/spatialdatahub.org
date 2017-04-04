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

// nominatim stuff
const placeInput = document.getElementById('place_input')
const placeButton = document.getElementById('place_button')
const selector = document.getElementById('selector')
const selectButton = document.getElementById('select_button')
const possiblePlaces = {}

const nominatim = 'http://nominatim.openstreetmap.org/search/'

// make geojson
// this is lifted from http://nominatim.openstreetmap.org/js/nominatim-ui.js
const normalize_geojson = obj => {
    // normalize places the geometry into a featurecollection, similar to
    // https://github.com/mapbox/geojson-normalize
    const geojson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: obj,
                properties: {}
            }
        ]
    }
    return geojson
}

// make selector options
const makeSelectorOptions = (array, selector) => {
  // clear selector options
  selector.innerHTML = ''
  array.forEach(p => {
    // get the osm data
    const display_name = p['display_name']
    const geojson = p['geojson']

    const option = document.createElement('option')
    option.value = display_name
    const text = document.createTextNode(display_name)
    const lyr = L.geoJSON(normalize_geojson(geojson))

    possiblePlaces[display_name] = lyr
    option.appendChild(text)
    selector.appendChild(option)
  })
}

const getPlace = url => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = () => {
      xhr.readyState === 4 && xhr.status === 200
      ? makeSelectorOptions(JSON.parse(xhr.responseText), selector)
      : console.log(xhr.statusText)
    }
    xhr.onerror = () => console.log('error')
    xhr.send()
  })
} 

placeButton.addEventListener('click', () => {
  const searchString = `${nominatim}${placeInput.value}?format=json&polygon_geojson=1`
  getPlace(searchString)
})

// tightly coupled with the selector options thing
// i can't just keep geojson in the possiblePlaces object, it must be layers, that way
// i can use the 'map.hasLayer()' function
selectButton.addEventListener('click', () => {
  Object.keys(possiblePlaces).forEach(n => {
    myMap.removeLayer(possiblePlaces[n])
  })

  const lyr = possiblePlaces[selector.value]
  lyr.addTo(myMap)
  myMap.fitBounds(lyr.getBounds()) 
})

// test url js

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

/*
What I need to do is write a bunch of stuff for turf

First, I need to save the test url data that are on the map in an obvious easy to access place,
then I need to convert them to geojson using the leaflet function '.ToGeoJSON()'. Then the same
thing needs to happen for the place polygon. Once that happens, I can use
'turf.within(points, polygon)' to get the points within the place polygon. Then I have to add
those data to a layer, and then add the layer to the map. There should also be a button that
toggles the points on and off, for the test url, place, and points within.

Once I've done this with a polygon and points I need to do a polygon intersect type thing for
polygon to polygon stuff.

Also, the nominatim stuff should be saved as an npm package that I can bring in to whatever
page I want. That will be for after I show the functionality off at the next meeting.
*/
