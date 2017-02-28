// CUSTOM MAP FUNCTIONS

// toggle map scrollability
const scrollWheelToggle = map => {
  map.scrollWheelZoom.enabled()
    ? map.scrollWheelZoom.disable()
    : map.scrollWheelZoom.enable()
}

// dataset toggle function

// get and save dataset function and array
const getDataset = (url, ext, map, array) => {

  // private function to be called when omnivore is ready
  const layerReady = dl => {
    map.fitBounds(dl.getBounds())
    map.addLayer(dl)
    array.push(dl)
  }

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
