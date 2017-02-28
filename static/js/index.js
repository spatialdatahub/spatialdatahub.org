// CUSTOM MAP FUNCTIONS

// toggle map scrollability
const scrollWheelToggle = map => {
  map.scrollWheelZoom.enabled()
    ? map.scrollWheelZoom.disable()
    : map.scrollWheelZoom.enable()
}

// toggle dataset, if already dataset, add it, else, get it
const datasetToggle = (map, obj, key, ext, url) => {
  obj[key]
    ?  map.hasLayer(obj[key])
         ? map.removeLayer(obj[key])
         : map.addLayer(obj[key]).fitBounds(obj[key].getBounds()) // little crazy with the chain
    : getDataset(map, obj, key, ext, url)
}

// get and save dataset to obj[key], and add it to map
const getDataset = (map, obj, key, ext, url)  => {

  // private function to be called when omnivore is ready
  const layerReady = dl => {
    map.fitBounds(dl.getBounds())
    map.addLayer(dl)
    obj[key] = dl
  }

  // check which type of dataset there is, and add it to map
  if (ext === 'kml') {
    const dataLayer = omnivore.kml(url, null)
      .on('ready', () => {
        layerReady(dataLayer)
      })
  } else if (ext === 'csv') {
    const dataLayer = omnivore.csv(url, null)
      .on('ready', () => {
        layerReady(dataLayer)
      })
  } else {
    const dataLayer = omnivore.geojson(url, null)
      .on('ready', () => {
        layerReady(dataLayer)
      })
  }
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
