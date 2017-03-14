// ////////////////////////////////////////////////////////////////////////////
/*
// CUSTOM MAP FUNCTIONS
*/
/*
// As I get better at programming I will try and put more functions in here
// but for right now I'm going to keep most of the javascript in the page
// specific javascript files.
*/
// ////////////////////////////////////////////////////////////////////////////

/*

// SEQUENCE A: run this on detailView.js on page load and on portalView.js
// on button click

// 1) check ext and select omnivore function
//   - this could probably be in the page specific js...

// 2) run omnivore function to get datalayer

// 3) after omnivore gets datalayer convert it to dataset

// 4) add dataset to L.geoJSON layer that can be modified
//    a) any modifications to the L.geoJSON layer should be predefined
//    b) any extra function should be called here

// 5) add L.geoJSON layer to the map

// 6) add L.geoJSON layer to an object as a key: value pair

// or

// 1) check ext and select omnivore function
const checkExt = ext => { ext === 'kml'
  ? omnivoreKML()
  : ext === 'csv'
    ? omnivoreCSV()
    : omnivoreGEOJSON()
}

// 2) run omnivore function with any L.geoJSON modifications immediately

// 3) add this datalayer to the map

// 4) add this datalayer to an object as a key:value pair

// 5) any further functions can then be run on it

*/


// 1) promisified omnivore functions
// these should probably be refactored
const getGeoJSON = url => {
  return new Promise( (resolve, reject) => {
    const dataLayer = omnivore.geojson(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

const getKML = url => {
  return new Promise( (resolve, reject) => {
    const dataLayer = omnivore.kml(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

const getCSV = url => {
  return new Promise( (resolve, reject) => {
    const dataLayer = omnivore.csv(url)
      .on('ready', () => resolve(dataLayer))
      .on('error', () => reject(Error('Url problem...')))
  })
}

// 2) function to choose which omnivore function to run
const extSelect = (ext, url) => {
  return ext === 'kml' ?
    getKML(url) :
    ext === 'csv' ?
      getCSV(url) :
      getGeoJSON(url)
}

// 3)
const addDataToContainer = (data, obj, key) => obj[key] = data


// 4) datasetToggleFunction // how can i write this to just do 'something' if 
// the conditions are not met? I could just return false... then say 'if false do this'
/*
const datasetToggle = (map, obj, key) => {
  return obj[key]
    ?  map.hasLayer(obj[key])
         ? map.removeLayer(obj[key])
         : map.addLayer(obj[key]).fitBounds(obj[key].getBounds()) // little crazy with the chain
    : false
}
*/

// how can I break this function down?
/*
const layerReady = (dl, map, obj, key, func) => {
  map.fitBounds(dl.getBounds())
  dl.addTo(map) 
  obj[key] = dl
}
*/

// decouple the functions
//   -url to get data from
//   -ext to decide which omnivore function to use
//   -obj and key (obj[key]) to save the data
// the only thing i'm doing is converting the data to geojson
// and saving in a specific place
const getDataset = (url, ext, map, obj, key, modJson, func) => {
  if (ext === 'kml') {
    const dl = omnivore.kml(url, null, modJson)
     .on('ready', () => {
        layerReady(dl, map, obj, key, modJson, func)
      })
  } else if (ext === 'csv') {
    const dl = omnivore.csv(url, null, modJson)
      .on('ready', () => {
        layerReady(dl, map, obj, key, modJson, func)
      })
  } else { 
    const dl = omnivore.geojson(url, null, modJson)
      .on('ready', () => {
        layerReady(dl, map, obj, key, modJson,func)
      })
  }
}

// toggle dataset, if already dataset, add it, else, get it
// instead of toggling the data on and off for the map, toggle it on and off
// for the modJson
const datasetToggle = (url, ext, map, obj, key, modJson, func) => {
  obj[key]
    ?  map.hasLayer(obj[key])
         ? map.removeLayer(obj[key])
         : map.addLayer(obj[key]).fitBounds(obj[key].getBounds()) // little crazy with the chain
    : getDataset(url, ext, map, obj, key, modJson, func)
}



// I need to make a nice looking popup background that scrolls
const popupHtml ='<dl id="popup-content"></dl>'

// add popups to the data points
// should this function be called every time a layer is added to a map? or will the layer 
// still have the popups after it's toggled off and on?
const addPopups = (feature, layer) => {

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
    maxHeight: 300,
    maxWidth: 300,
    autoPanPaddingTopLeft: [50, 50],
    autoPanPaddingTopRight: [50, 50]
  }

  const popup = L.popup(popupOptions)
   .setContent(popupHtml.innerHTML=popupContent.join(''))


  layer.bindPopup(popup)

  // make array to add content to
  /*


  // bind the popupContent array to the layer's layers
  layer.bindPopup(popupHtml.innerHTML=popupContent.join('')) // this is where the popup html will be implemented
*/

}





// THESE THREE CONTROL FUNCTIONS ARE TIGHTLY COUPLED WITH DIFFERENT THINGS
// THEY WILL HAVE TO BE CHANGED EVENTUALLY
// ZMT watermark by extending Leaflet Control
L.Control.Watermark = L.Control.extend({
  onAdd: (map) => {
    const img = L.DomUtil.create('img')
    // this will have to be changed relative to the site for production
    img.src = 'http://localhost:8000/static/images/zmt_logo_blue_black_100px.png'
    // img.src = imgSrc
    img.style.width = '100px'
    return img
  },
  onRemove: (map) => {
    // Nothing to do here
  }
})

// Home button by extending Leaflet Control
L.Control.HomeButton = L.Control.extend({
  onAdd: (map) => {
    const container = L.DomUtil.create('div',
      'leaflet-bar leaflet-control leaflet-control-custom')
    //  container.innerHTML = '<i class="fa fa-home fa-2x" aria-hidden="true"></i>'
    container.style.backgroundImage = 'url("http://localhost:8000/static/images/home_icon.png")'
    container.style.backgroundRepeat = 'no-repeat'
    container.style.backgroundColor = 'white'
    container.style.width = '34px'
    container.style.height = '34px'
    container.addEventListener('click', () => map.setView({lat: 0, lng: 0}, 2))
    return container
  },
  onRemove: (map) => {
    // Nothing to do here
  }
})

// scroll wheel toggle button
L.Control.ToggleScrollButton = L.Control.extend({
  onAdd: (map) => {
    const container = L.DomUtil.create('div',
      'leaflet-bar leaflet-control leaflet-control-custom')
    container.style.backgroundImage = 'url("http://localhost:8000/static/images/mouse.png")'
    container.style.backgroundRepeat = 'no-repeat'
    container.style.backgroundColor = 'white'
    container.style.width = '34px'
    container.style.height = '34px'
    container.addEventListener('click', () => {
      map.scrollWheelZoom.enabled()
        ? map.scrollWheelZoom.disable()
        : map.scrollWheelZoom.enable()
    })
    return container
  },
  onRemove: (map) => {
    // Nothing to do here
  }
})
