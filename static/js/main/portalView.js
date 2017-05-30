// ////////////////////////////////////////////////////////////////////////////
/*
// PORTAL SPECIFIC FUNCTIONS
*/
/*
// I need a better way to keep track of stuff. This whole document is getting
// bigger and bigger, with more and more variables and they are difficult to
// key track of. Further more, many of them refer to dom elements, whether they
// create dom elements, or they just call them. In the mean time I can make a
// list of the elements somewhere, and then a list of the functions. Then maybe
// it will be easier to maintain this page.
*/
// ////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////
// Refactoring Plans, not rewriting ///////////////////////////////////////////
/*
// Make container for all layers on the map. The map keep layers as unnamed
// objects, which makes them difficult to find. So, if I want a reference to a
// layer that has been added it needs to be kept in an array. There should also
// be an 'activeLayers' array. This would usually just be the map with a .hasLayer
// question, but if I want to pull all active layers, and maintain their references
// then I need to have them in an array, or at least their names in an array.
*/
// ////////////////////////////////////////////////////////////////////////////

// colors
const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red']
let linkDatasetColorCounter = 0 // this is for the datasets from the links

// pointMarkerOptions
const markerOptions = {
  radius: 6,
  color: 'black',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
}

const selectedLinkContainer = document.getElementById('selected_link')

// After dataset list load

// to toggle active datasets on the map, and otherwise I need the list
// of datasets should this be a const?
const activeDatasetButtons = []
const datasetLinks = document.getElementsByName('dataset')
const datasets = {} // is this redundant?

////////////////////////////////////////////////////////////////////////
// This is the loop that gets data from the dataset list
// It gets each dataset's exension, primary key and url.
// The loop creates a leaflet geojson layer with preset properties (such
// as point size, color of points, etc) and adds the data to that leaflet layer.
// The loop also toggle's the html element's class from not active to active,
// which allows the bootstrap css to change the way the button looks. The
// loop also adds an event listener to the links that takes click events. The
// button click gets the dataset with a fetch event either straight from the url
// or by calling the server and making python get the data, then it adds the
// data to the map. If the data have already been fetched it simply calls
// the data from where they are stored locally. This loop also adds a breadcrumb
// to the html page.
//
// If this loop breaks, everything else breaks. How do I prevent that?
// Should the loop be broken into smaller loops? Should it just remain a monster
// that calls functions?
////////////////////////////////////////////////////////////////////////
datasetLinks.forEach(function handleDatasetLink (link) {
  const ext = link.getAttribute('id')
  const pk = link.getAttribute('value')

  // this should be done better
  let url
  link.getAttribute('url')
    ? url = link.getAttribute('url')
    : url = `/load_dataset/${pk}`

  // deal with colors
  linkDatasetColorCounter++
  const color = colors[linkDatasetColorCounter % colors.length]

  // Every time I call the 'getDataset' function there needs to be a new modJson called
  // there should probably also be a marker cluster function called
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

  const linkParent = link.parentElement

  activeDatasetButtons.push(linkParent)

  // one more thing I have to do is append the dataset to the bread crumbs on click
  // sorta hacky... this should be written better
  const dsText = link.textContent
  const dsLink = link.getAttribute('link')
  const breadcrumb = `<a href="${dsLink}">Go to the ${dsText} detail page</a>`

  link.addEventListener('click', function linkEvent () {
    classToggle(linkParent, 'active')

    datasets[pk]
      ? myMap.hasLayer(datasets[pk])
        ? myMap.removeLayer(datasets[pk])
        : myMap.addLayer(datasets[pk]).fitBounds(datasets[pk].getBounds())
      // if there is no datasets[pk] then go through the process of selecting
      // the right omnivore function and getting the data and stuff
      : extSelect(ext, url) // the promise
        .then(function handleResponse (response) {
          layerMod.addData(response.toGeoJSON()) // modify the layer
          myMap.addLayer(layerMod).fitBounds(layerMod.getBounds())
          addDataToContainer(layerMod, datasets, pk)
        }, function handleError (error) {
          console.log(error)
        })

    // append breadcrumbs links to breadcrumbs thing on click
    selectedLinkContainer.innerHTML = breadcrumb
  })
})

// ///// NEW FILTER STUFF ////////
// Should this stuff be put into a different file? 

// nominatim stuff

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const findPlaceButton = document.getElementById('find_place_button')
const findPlaceContainer = document.getElementById('find_place_container')

findPlaceButton.addEventListener('click', function showPlaceContainer () {
  classToggle(findPlaceButton, 'active')

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

// select place to display
selectButton.addEventListener('click', function selectPlace () {
  Object.values(possiblePlaceLayers).forEach(n => {
    myMap.removeLayer(n)
  })

  selectedPlace.length !== 0
    ? (selectedPlace.pop(), selectedPlace.push(possiblePlaceLayers[selector.value]))
    : selectedPlace.push(possiblePlaceLayers[selector.value])
  console.log(possiblePlaceLayers)

  
  const selectedPlaceType = selectedPlace[0].toGeoJSON().features[0].geometry.type
  if (selectedPlaceType === 'Polygon' || selectedPlaceType === 'MultiPolygon') {
    const p = selectedPlace[0]
    saidPolygon.push(p)
  }

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

// test URL stuff

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const testUrlButton = document.getElementById('test_url_button')
const testUrlContainer = document.getElementById('test_url_container')

testUrlButton.addEventListener('click', function showTestUrlContainer () {

  classToggle(testUrlButton, 'active')

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

// within polygon stuff
const saidPolygon = []
const fileContainer = []

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const withinPolygonButton = document.getElementById('within_polygon_button')
const withinPolygonContainer = document.getElementById('within_polygon_container')

// (2) make buttons that will get the data
const getDataWithinPolygonButton = addButton('Get data within polygon', 'black', withinPolygonContainer)
getDataWithinPolygonButton.setAttribute('class', 'btn btn-default')

function showWithinPolygonContainer () {
  classToggle(withinPolygonButton, 'active')

  if (saidPolygon[0]) {
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

function getDataWithinPolygon () {
// check if the buttons and containers are already here, and if they are clear them,
// if they are not then create them for the first time, or something. Don't make them
// twice.

// this doesn't work
//  if (withinPolygonContainer.childElementCount > 1) {
//    console.log(withinPolygonContainer.childElementCount)
//    showWithinPolygonContainer()
//  }

  // polygon
  const poly = saidPolygon[0].toGeoJSON()

  const pointsLayers = Object.values(testDatasets).map(v => {
    if (myMap.hasLayer(v)) {
      const l = v.toGeoJSON().features[0].geometry.type
      if (l === 'Point' || l === 'MultiPoint') {
        return v.toGeoJSON()
      }
    }
  })

  const pointsWithinLayer = L.geoJSON(null).addTo(myMap)

  // run the turf.within function, and add the data to the layer that will
  // be added to the map, and also converted to geojson and saved.
  pointsLayers.forEach(l => {
    const n = turf.within(l, poly)
    pointsWithinLayer.addData(n)
  })

  // make file name input
  const fileNameInput = document.createElement('input')
  fileNameInput.setAttribute('class', 'form-control')
  fileNameInput.setAttribute('placeholder', 'Enter the file name here')
  fileNameInput.setAttribute('type', 'text')
  withinPolygonContainer.append(fileNameInput)

  const saveButton = addButton('Save to geojson file', 'black', withinPolygonContainer)

  saveButton.classList.remove('active')

  saveButton.addEventListener('click', () => saveFile(pointsWithinLayer, fileNameInput))
}

withinPolygonButton.addEventListener('click', showWithinPolygonContainer)
getDataWithinPolygonButton.addEventListener('click', getDataWithinPolygon)

// (3) add event listener to button that gets the data

// should this function be defined separately, and have arguements?

////////////////////////////////////////////////////////////////////////
// This button/function converts the polygon stored in the 'saidPolygon'
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
