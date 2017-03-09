// ////////////////////////////////////////////////////////////////////////////
/*
// CUSTOM MAP FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////


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

// how can I break this function down?

const layerReady = (dl, map, obj, key, modJson, func) => {
  obj[key] = dl
  modJson.addData(dl.toGeoJSON())
  modJson.addTo(map) 
  map.fitBounds(modJson.getBounds())
  func(modJson)
}

// decouple the functions
//   -url to get data from
//   -ext to decide which omnivore function to use
//   -obj and key (obj[key]) to save the data
// the only thing i'm doing is converting the data to geojson
// and saving in a specific place
const getDataset = (url, ext, map, obj, key, modJson, func) => {
  if (ext === 'kml') {
    const dl = omnivore.kml(url)
     .on('ready', () => {
        layerReady(dl, map, obj, key, modJson, func)
      })
  } else if (ext === 'csv') {
    const dl = omnivore.csv(url)
      .on('ready', () => {
        layerReady(dl, map, obj, key, modJson, func)
      })
  } else { 
    const dl = omnivore.geojson(url)
      .on('ready', () => {
        layerReady(dl, map, obj, key, modJson, func)
      })
  }
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
