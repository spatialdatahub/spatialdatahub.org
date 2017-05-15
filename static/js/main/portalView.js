// ////////////////////////////////////////////////////////////////////////////
/*
// PORTAL SPECIFIC FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////

// Before dataset list load

// colors
const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red']
let colorCounter = 0

// pointMarkerOptions
const markerOptions = {
  radius: 6,
  color: 'black',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.4
}

// change this to selected link container
const breadcrumbContainer = document.getElementById('selected_link')

// After dataset list load

// to toggle active datasets on the map, and otherwise I need the list
// of datasets should this be a const?
const datasetLinks = document.getElementsByName('dataset')
const datasets = {}

// add event that toggles the link's class from active to not active
datasetLinks.forEach(function handleLink(link) {
  const ext = link.getAttribute('id')
  const pk = link.getAttribute('value')

  // this should be done better
  let url
  link.getAttribute('url')
  ? url = link.getAttribute('url')
  : url = `/load_dataset/${pk}`

  // deal with colors
  colorCounter++
  const color = colors[colorCounter % colors.length]

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

  // one more thing I have to do is append the dataset to the bread crumbs on click
  // sorta hacky... this should be written better
  const dsText = link.textContent
  const dsLink = link.getAttribute('link')
  const breadcrumb = `<a href="${dsLink}">Go to the ${dsText} detail page</a>`

  link.addEventListener('click', function linkEvent() {
    classToggle(linkParent, 'active')

    datasets[pk]
      ? myMap.hasLayer(datasets[pk])
        ? myMap.removeLayer(datasets[pk])
        : myMap.addLayer(datasets[pk]).fitBounds(datasets[pk].getBounds())
      // if there is no datasets[pk] then go through the process of selecting
      // the right omnivore function and getting the data and stuff
      : extSelect(ext, url) // the promise
        .then(function handleResponse(response) {
          layerMod.addData(response.toGeoJSON()) // modify the layer
          myMap.addLayer(layerMod).fitBounds(layerMod.getBounds())
          addDataToContainer(layerMod, datasets, pk)
        }, function handleError(error) {
          console.log(error)
        })

    // append breadcrumbs links to breadcrumbs thing on click
    breadcrumbContainer.innerHTML = breadcrumb
  })
})

//////// NEW FILTER STUFF ////////


// nominatim stuff

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const findPlaceButton = document.getElementById('find_place_button')
const findPlaceContainer = document.getElementById('find_place_container')

findPlaceButton.addEventListener('click', function hidePlaceContainer() {

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

function makeSelectorOptions(array) {
  selector.innerHTML = ''
  array.forEach(place => {
    const obj = {}
    obj.display_name = place.display_name
    obj.geojson = place.geojson

    const display_name = obj.display_name

    const option = document.createElement('option')
    option.value = obj.display_name
    const text = document.createTextNode(obj.display_name)
    option.appendChild(text)
    selector.appendChild(option)

    const lyr = L.geoJson(obj.geojson)
    possiblePlaceLayers[display_name] = lyr
  })
}

// add place(s) to the selector
placeButton.addEventListener('click', function findPlace() {
  const val = placeInput.value
  const data = en.getPlaceData(val, makeSelectorOptions)
})

// select place to display
selectButton.addEventListener('click', function selectPlace() {
  Object.values(possiblePlaceLayers).forEach(n => {
    myMap.removeLayer(n)
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


// test URL stuff

// (1) hide and show nominatim stuff (do this after I've gotten it working)
const testUrlButton = document.getElementById('test_url_button')
const testUrlContainer = document.getElementById('test_url_container')

testUrlButton.addEventListener('click', function hideTestUrlContainer() {

  classToggle(testUrlButton, 'active')

  testUrlContainer.style.display === 'none' || testUrlContainer.style.display === ''
  ? testUrlContainer.style.display = 'block'
  : testUrlContainer.style.display = 'none'
})

// (2) get elements



