const L = require('leaflet')
const omnivore = require('@mapbox/leaflet-omnivore')

// /////////// //
// indexMap.js //
// /////////// //

// 1) promisified omnivore functions
// these should probably be refactored
// they don't need to be exposed to the rest of the code base
// they are only used here
function getGeoJSON (url) {
  return new Promise(function handlePromise (resolve, reject) {
    const dataLayer = omnivore.geojson(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

function getKML (url) {
  return new Promise(function handlePromise (resolve, reject) {
    const dataLayer = omnivore.kml(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

function getCSV (url) {
  return new Promise(function handlePromise (resolve, reject) {
    const dataLayer = omnivore.csv(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

// 2) function to choose which omnivore function to run
exports.extSelect = function (ext, url) {
  return ext === 'kml'
    ? getKML(url)
    : ext === 'csv'
    ? getCSV(url)
    : getGeoJSON(url)
}

// I need to make a nice looking popup background that scrolls
// why isn't this in the add popups function?
// innerHTML doesn't work on this, because it's still a string in this document
// just make it part of the set content thing
//const popupHtml = '<dl id="popup-content"></dl>'

// add popups to the data points
// should this function be called every time a layer is added to a map?
// or will the layer still have the popups after it's toggled off and on?
exports.addPopups = function (feature, layer) {
  const popupContent = []

  // first check if there are properties
  feature.properties.length !== undefined || feature.properties.length !== 0
    // push data from the dataset to the array
    ? Object.keys(feature.properties).forEach(key => {
      popupContent.push(`<dt>${key}</dt> <dd>${feature.properties[key]}</dd>`)
    })
    : console.log('No feature properties')

  // push feature cordinates to the popupContent array, if it's a point dataset
  feature.geometry.type === 'Point'
    ? popupContent.push(
        `<dt>Latitude:</dt> <dd>${feature.geometry.coordinates[1]}</dd>`,
        `<dt>Longitude:</dt> <dd>${feature.geometry.coordinates[0]}</dd>`
      )
    : console.log(feature.geometry.type)

  // set max height and width so popup will scroll up and down, and side to side
  const popupOptions = {
//    maxHeight: 300,
//    maxWidth: 300,
//    autoPanPaddingTopLeft: [50, 50],
//    autoPanPaddingTopRight: [50, 50]
  }


  const content = `<dl id="popup-content">${popupContent.join('')}</dl>`

  const popup = L.popup(popupOptions).setContent(content)

  layer.bindPopup(popup)

  // make array to add content to
  /*

  // bind the popupContent array to the layer's layers
  layer.bindPopup(popupHtml.innerHTML=popupContent.join('')) // this is where the popup html will be implemented
*/
}



