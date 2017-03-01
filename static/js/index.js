// CUSTOM MAP FUNCTIONS

// toggle map scrollability
const scrollWheelToggle = map => {
  map.scrollWheelZoom.enabled()
    ? map.scrollWheelZoom.disable()
    : map.scrollWheelZoom.enable()
}

// toggle dataset, if already dataset, add it, else, get it
const datasetToggle = (map, obj, key, ext, url, modJson) => {
  obj[key]
    ?  map.hasLayer(obj[key])
         ? map.removeLayer(obj[key])
         : map.addLayer(obj[key]).fitBounds(obj[key].getBounds()) // little crazy with the chain
    : getDataset(map, obj, key, ext, url, modJson)
}

// private function to be called when omnivore is ready
// can this be lifted from this function? Can it be public?
const layerReady = (dl, map, obj, key) => {
  map.fitBounds(dl.getBounds())
  map.addLayer(dl)
  obj[key] = dl
}

// get and save dataset to obj[key], and add it to map
const getDataset = (map, obj, key, ext, url, modJson)  => {

  // check which type of dataset there is, and add it to map
  if (ext === 'kml') {
    const dataLayer = omnivore.kml(url, null, modJson)
      .on('ready', () => {
        layerReady(dataLayer, map, obj, key)
      })
  } else if (ext === 'csv') {
    const dataLayer = omnivore.csv(url, null, modJson)
      .on('ready', () => {
        layerReady(dataLayer, map, obj, key)
      })
  } else {
    const dataLayer = omnivore.geojson(url, null, modJson)
      .on('ready', () => {
        layerReady(dataLayer, map, obj, key)
      })
  }
} 

// add popups to the data points
// should this function be called every time a layer is added to a map? or will the layer 
// still have the popups after it's toggled off and on?
const addPopups = (feature, layer) => {
  // make array to add content to
  popupContent = []
  //console.log(feature.properties)

  // first check if there are properties
  feature.properties.length !== undefined || feature.properties.length !== 0
    // push data from the dataset to the array
    ? Object.keys(feature.properties).forEach(key => {
        popupContent.push(`<b>${key}</b>: ${feature.properties[key]}`)
      })
    : console.log('No feature properties')

  // push feature cordinates to the popupContent array, if it's a point dataset
  feature.geometry === 'Point'
    ? popupContent.push(
        `<b>Latitude:</b> ${feature.geometry.coordinates[1]}`,
        `<b>Longitude:</b> ${feature.geometry.coordinates[0]}`
      )
    : console.log(feature.geometry.type)

  // bind the popupContent array to the layer's layers
  layer.bindPopup(popupContent.join(`<br/>`))

}

// CUSTOM OTHER FUNCTIONS

// toggle active / inactive links in list
// almost exactly copied from 'youmightnotneedjquery.com'
const classToggle = (el, className) => {
  if (el.classList) {
    el.classList.toggle(className) 
  } else {
    const classes = el.className.split(' ') 
    const existingIndex = classes.indexOf(className) 
    if (existingIndex >= 0)
      classes.splice(existingIndex, 1) 
    else
      classes.push(className) 
    el.className = classes.join(' ') 
  }
}
