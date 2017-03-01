// CUSTOM MAP FUNCTIONS

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
  // this should be a function or a loop. I really don't like this if else
  // set that does almost the exact same thing
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

  // first check if there are properties
  feature.properties.length !== undefined || feature.properties.length !== 0
    // push data from the dataset to the array
    ? Object.keys(feature.properties).forEach(key => {
        popupContent.push(`<b>${key}</b>: ${feature.properties[key]}`)
      })
    : console.log('No feature properties')

  // push feature cordinates to the popupContent array, if it's a point dataset
  feature.geometry.type === 'Point'
    ? popupContent.push(
        `<b>Latitude:</b> ${feature.geometry.coordinates[1]}`,
        `<b>Longitude:</b> ${feature.geometry.coordinates[0]}`
      )
    : console.log(feature.geometry.type)

  // bind the popupContent array to the layer's layers
  layer.bindPopup(popupContent.join(`<br/>`))

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
