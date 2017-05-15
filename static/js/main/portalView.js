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

const findPlaceButton = document.getElementById('find_place_button')
const testUrlButton = document.getElementById('test_url_button')
const drawPolygonButton = document.getElementById('draw_polygon_button')

const findPlaceContainer = document.getElementById('find_place_container')


findPlaceButton.addEventListener('click', function findPlaceButtonEvent() {
  // switch button from inactive to active on click
  classToggle(findPlaceButton, 'active')

  // make stuff to be added to container
  // would it be better for me to make a separate view or somthing to bring in?
  // start with making it all here, then go from there
  const findPlaceHtml = '/static/html/find_place.html'  

  // add stuff to container div
  // dataToDiv('yeah, this is data', findPlaceContainer)

  makeReq(findPlaceHtml, dataToDiv, findPlaceContainer)

})

testUrlButton.addEventListener('click', function testUrlButtonEvent() {
  // switch button from inactive to active on click
  classToggle(testUrlButton, 'active')
})

drawPolygonButton.addEventListener('click', function drawPolygonButtonEvent() {
  // switch button from inactive to active on click
  classToggle(drawPolygonButton, 'active')
})
