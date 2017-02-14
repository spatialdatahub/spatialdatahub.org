// Set up basic variables then move to functions that I will use to deal with
// data and stuff

const osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">
  OpenStreetMap</a>`,
  minZoom: 2,
  maxZoom: 19
})

const stamenToner = L.tileLayer(`http://stamen-tiles-{s}.a.ssl.fastly.net/
toner/{z}/{x}/{y}.{ext}`, {
  attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
  <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>
  &mdash; Map data &copy;
  <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
  subdomains: 'abcd',
  minZoom: 2,
  maxZoom: 19,
  ext: 'png'
})

const esriWorldImagery = L.tileLayer(`http://server.arcgisonline.com/ArcGIS/
rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`, {
  attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA,
  USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP,
  and the GIS User Community`
})

// set up map, view and base layer
const myMap = new L.Map('mapid', {
  center: {lat: 0, lng: 8.8460},
  zoom: 2,
  layers: osm,
  scrollWheelZoom: false
})

const baseLayers = {
  'Open Street Maps': osm,
  'Black and White': stamenToner,
  'ESRI World Map': esriWorldImagery
}

// values to be used in the file
const value = document.getElementById('dataset_pk').getAttribute('value')
const datasetUrl = `/load_dataset/${value}`
const ext = document.getElementById('dataset_ext').getAttribute('value')

// containers
const filteredLayer = L.geoJson()

// Do function stuff
// Control button creation -- eventually this will need to be written better
L.Control.Watermark = L.Control.extend({
  onAdd: (map) => {
    const img = L.DomUtil.create('img')
    // this will have to be changed relative to the site for production
    img.src = 'http://localhost:8000/static/images/zmt_logo_blue_black' +
      '_100px.png'
    img.style.width = '100px'
    return img
  },
  onRemove: (map) => {
    // Nothing to do here
  }
})

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

// Can I separate XMLHttpRequest calls, Promises, and if/else statements?
// Start by separating the kml / csv / json XMLHttpRequests.
// function to get data from geojson dataset with a promise
// Can I do this without using all the promise logic in here?

// I hate repeating code, i've already had issues with errors because of it

// JSON
const getJSONDataset = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => {
      xhr.readyState === 4 && xhr.status === 200
        ? resolve(JSON.parse(xhr.responseText)) : reject(Error(xhr.statusText))
    }
    xhr.onerror = () => reject(Error('Network Error - JSON'))
    xhr.send()
  })
  return promise
}

// KML
const getKMLDataset = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'document' // this line
    xhr.overrideMimeType('text/xml') // and this line are making my life tough
    xhr.onload = () => {
      xhr.readyState === 4 && xhr.status === 200
        ? resolve(toGeoJSON.kml(xhr.response)) : reject(Error(xhr.statusText))
    }
    xhr.onerror = () => reject(Error('Network Error - KML'))
    xhr.send()
  })
  return promise
}

// CSV
const getCSVDataset = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = () => {
      xhr.readyState === 4 && xhr.status === 200
        ? csv2geojson.csv2geojson(
            xhr.responseText, (err, data) => {
              err ? reject(Error(err)) : resolve(data)
            }
          )
        : reject(Error(xhr.statusText))
    }
    xhr.onerror = () => reject(Error('Network Error - CSV'))
    xhr.send()
  })
  return promise
}

// I need to make a function or something that takes the ext and calls the
// correct getData function

// build filtering select function

// Implement functions
// this one is sorta not in the right style
L.control.layers(baseLayers).addTo(myMap)

L.control.watermark = (options) => new L.Control.Watermark(options)
L.control.watermark({position: 'bottomleft'}).addTo(myMap)

L.control.homebutton = (options) => new L.Control.HomeButton(options)
L.control.homebutton({position: 'topleft'}).addTo(myMap)

L.control.togglescrollbutton = (options) => new L.Control.ToggleScrollButton(options)

L.control.togglescrollbutton({position: 'topleft'}).addTo(myMap)

// make sure filteredLayer is added to the map
filteredLayer.addTo(myMap)

// Function that calls correct get___Dataset function based on ext
// this should be written differently

if (ext === 'kml') {
  getKMLDataset(datasetUrl)
    .then(data => filteredLayer.addData(data),
      error => console.log(error))
} else if (ext === 'csv') {
  getCSVDataset(datasetUrl)
    .then(data => filteredLayer.addData(data),
      error => console.log(error))
} else {
  getJSONDataset(datasetUrl)
    .then(data => filteredLayer.addData(data),
      error => console.log(error))
}
