// /////////////////////////////////////////////////////////////////////////
// nominatim
// /////////////////////////////////////////////////////////////////////////

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const showFindPlaceContainerButton = document.getElementById('show_find_place_container_button')
const findPlaceContainer = document.getElementById('find_place_container')

showFindPlaceContainerButton.addEventListener('click', function showPlaceContainer () {
  classToggle(showFindPlaceContainerButton, 'active')

  findPlaceContainer.style.display === 'none' || findPlaceContainer.style.display === ''
    ? findPlaceContainer.style.display = 'block'
    : findPlaceContainer.style.display = 'none'
})

// (2) get elements
const placeInput = document.getElementById('place_input')
const placeButton = document.getElementById('place_button')
const placeToggle = document.getElementById('place_toggle')
const selector = document.getElementById('selector')
const selectButton = document.getElementById('select_button')

// define containers
const possiblePlaceLayers = {} // this is where i keep the layers to query the map with
const selectedPlace = []

activeDatasetButtons.push(placeButton, placeToggle, selectButton)

function makeSelectorOptions (array) {
  selector.innerHTML = ''
  array.forEach(place => {
    const option = document.createElement('option')
    option.value = place.display_name
    const text = document.createTextNode(place.display_name)
    option.appendChild(text)
    selector.appendChild(option)

    const lyr = L.geoJson(place.geojson)
    possiblePlaceLayers[place.display_name] = lyr
  })
}

// add place(s) to the selector
placeButton.addEventListener('click', function findPlace () {
  const val = placeInput.value
  en.getPlaceData(val, makeSelectorOptions)
})

function getSelectedPlacePolygon (sp) {
  // first make sure that sp has something
  if (sp[0]) {
    // maybe this should just be a function that returns the polygon if it's there
    const selectedPlaceType = sp[0].toGeoJSON().features[0].geometry.type
    if (selectedPlaceType === 'Polygon' || selectedPlaceType === 'MultiPolygon') {
      const p = sp[0]
      return p.toGeoJSON()
    } else {
      return 'not a polygon'
    }
  } else {
    return 'not a polygon'
  }  
}

// select place to display
selectButton.addEventListener('click', function selectPlace () {

  Object.keys(possiblePlaceLayers).forEach(n => {
    const p = possiblePlaceLayers[n]
    myMap.removeLayer(p)
  })

  selectedPlace.length !== 0
    ? (selectedPlace.pop(), selectedPlace.push(possiblePlaceLayers[selector.value]))
    : selectedPlace.push(possiblePlaceLayers[selector.value])

  const lyr = selectedPlace[0]
  lyr.addTo(myMap)
  myMap.fitBounds(lyr.getBounds())
})

// map and layer should be arguements for a predefined function
placeToggle.addEventListener('click', () => {
  myMap.hasLayer(selectedPlace[0])
    ? myMap.removeLayer(selectedPlace[0])
    : myMap.addLayer(selectedPlace[0])
})

// /////////////////////////////////////////////////////////////////////////
// end nominatim
// /////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////
// test url
// /////////////////////////////////////////////////////////////////////////

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const showTestUrlContainerButton = document.getElementById('show_test_url_container_button')
const testUrlContainer = document.getElementById('test_url_container')

showTestUrlContainerButton.addEventListener('click', function showTestUrlContainer () {

  classToggle(showTestUrlContainerButton, 'active')

  testUrlContainer.style.display === 'none' || testUrlContainer.style.display === ''
    ? testUrlContainer.style.display = 'block'
    : testUrlContainer.style.display = 'none'
})

// (2) get elements
const testUrlInput = document.getElementById('test_url_input')
const getTestUrl = document.getElementById('get_test_url')
const toggleTestUrlsButton = document.getElementById('toggle_test_urls')
const testUrls = document.getElementById('test_urls')

const testDatasets = {}
let testDatasetCount = 0

// pointMarkerOptions
const testUrlMarkerOptions = {
  radius: 6,
  color: 'white',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
}

getTestUrl.addEventListener('click', function getDataFromTestUrl () {
  // get ext and url
  const ext = getExt(testUrlInput.value)
  const url = testUrlInput.value

  // increment the color counter
  testDatasetCount++
  const testDatasetColor = colors[testDatasetCount % colors.length]

  // get the data with the correct ext, why is this stuff different than
  // the  functions we already have? I'll refactor later
  extSelect(ext, url)
    .then(function handleResponse (response) {
      // make this into a layer
      const layerMod = L.geoJson(null, {
        // set the points to little circles
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, markerOptions)
        },
        onEachFeature: (feature, layer) => {
          // make sure the fill is the color
          layer.options.fillColor = testDatasetColor
          // and make sure the perimiter is black (if it's a point) and the color otherwise
          feature.geometry.type === 'Point'
            ? layer.options.color = 'white'
            : layer.options.color = testDatasetColor
          // add those popups
          addPopups(feature, layer) // this comes from the index_maps.js file
        }
      })

      // if the response is good then add abutton for it
      // Ugh, I'm using the 'this' keyword. Not cool.
      // refactor later
      const btn = addButton(testDatasetCount, testDatasetColor, testUrls)

      activeDatasetButtons.push(btn)

      btn.addEventListener('click', function () {
        classToggle(btn, 'active')
        const val = btn.getAttribute('value')
        myMap.hasLayer(testDatasets[val])
          ? myMap.removeLayer(testDatasets[val])
          : myMap.addLayer(testDatasets[val])
      })

      // modify data here
      layerMod.addData(response.toGeoJSON())

      testDatasets[testDatasetCount] = layerMod

      myMap.addLayer(layerMod).fitBounds(layerMod.getBounds())
    }, function handleError (error) {
      console.log(error)
    })
})

// /////////////////////////////////////////////////////////////////////////
// end test url
// /////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////
// within polygon
// /////////////////////////////////////////////////////////////////////////

const fileContainer = []

// (1) hide and show nominatim stuff (do this after I've gotten it working)
// rename this to showWithinPolygonContainer
const showWithinPolygonContainerButton = document.getElementById('show_within_polygon_container_button')
const withinPolygonContainer = document.getElementById('within_polygon_container')

// Instead of making a button here makeit in the html, and display/hide it here
// (2) make buttons that will get the data
const getDataWithinPolygonButton = addButton('Get data within polygon', 'black', withinPolygonContainer)
getDataWithinPolygonButton.setAttribute('class', 'btn btn-default')

function showWithinPolygonContainerFunc () {
  classToggle(showWithinPolygonContainerButton, 'active')

  if (getSelectedPlacePolygon(selectedPlace) !== 'not a polygon') {
    withinPolygonContainer.innerHTML = '' // why doesn't this clear everything in the container?
    withinPolygonContainer.appendChild(getDataWithinPolygonButton)
  } else {
    withinPolygonContainer.innerHTML = '<h4>You need a polygon first, get one with the' +
    ' place selector or draw one.</h4>'
  }

  withinPolygonContainer.style.display === 'none' || withinPolygonContainer.style.display === ''
    ? withinPolygonContainer.style.display = 'block'
    : withinPolygonContainer.style.display = 'none'
}

function saveFile (layer, fileNameInput) {
  const filename = fileNameInput.value
  const data = JSON.stringify(layer.toGeoJSON())
  const blob = new Blob([data], {type: 'text/plain; charset=utf-8'})
  saveAs(blob, filename + '.geojson')
}

function getDataWithinPolygonFunc (poly, layer) {
  const pointsLayers = Object.keys(testDatasets).map(k => {
    const v = testDatasets[k]
    if (myMap.hasLayer(v)) {
      const l = v.toGeoJSON().features[0].geometry.type
      if (l === 'Point' || l === 'MultiPoint') {
        return v.toGeoJSON()
      }
    }
  })

  // run the turf.within function, and add the data to the layer that will
  // be added to the map, and also converted to geojson and saved.
  
  pointsLayers.forEach(l => {
    const n = turf.within(l, poly)
    layer.addData(n)
  })

  // return a layer with the points
  return layer
}

showWithinPolygonContainerButton.addEventListener('click', showWithinPolygonContainerFunc)

getDataWithinPolygonButton.addEventListener('click', () => {
  // This is pretty ugly, but right now it works, it will be
  // refactored

  const pointsWithinLayer = L.geoJSON(null).addTo(myMap)
  getDataWithinPolygonFunc(getSelectedPlacePolygon(selectedPlace), pointsWithinLayer)

  if (document.getElementById('file_name_input')) {
    var fni = document.getElementById('file_name_input')
    var fsb = document.getElementById('file_save_button')
    fni.parentNode.removeChild(fni)
    fsb.parentNode.removeChild(fsb)
  }

  // How do I delete this input and save button and re create them on every button press
  // make file name input
  const fileNameInput = document.createElement('input')
  fileNameInput.id = 'file_name_input'
  fileNameInput.setAttribute('class', 'form-control')
  fileNameInput.setAttribute('placeholder', 'Enter the file name here')
  fileNameInput.setAttribute('type', 'text')
  withinPolygonContainer.appendChild(fileNameInput)

  // Instead of having a save button, I should just have the html in the template
  // make save button
  const saveButton = addButton('Save to geojson file', 'black', withinPolygonContainer)
  saveButton.id = 'file_save_button'
  saveButton.classList.remove('active')
  saveButton.addEventListener('click', () => saveFile(pointsWithinLayer, fileNameInput))

})

// (3) add event listener to button that gets the data

// should this function be defined separately, and have arguements?

////////////////////////////////////////////////////////////////////////
// This button/function converts the polygon stored in the selectedPlace
// container and coverts it to geojson. It then gets all the active points
// layers from the map and checks if they fall within a polygon. If they
// are in the polygon, then they are added to a leaflet geojson layer
// which is added to the map. This layer can then be saved to a file
// using the 'filesaver' javascript script functionality. The function
// creates buttons that save the data to a file, and clears the data
// from the saved 
////////////////////////////////////////////////////////////////////////


// clear map
// get button and add click event

const clearMapButton = document.getElementById('clear_map')

clearMapButton.addEventListener('click', function clearMap () {
  // toggle 'active' class off
  activeDatasetButtons.forEach(function deactivate (link) {
    link.classList.remove('active')
  })

  // get all layers from map
  myMap.eachLayer(function clearLayers (layer) {
    // make sure not to remove tile layers
    if (layer !== osm && layer !== stamenToner && layer !== esriWorldImagery) {
      // remove layers
      myMap.removeLayer(layer)
    }
  })
})

