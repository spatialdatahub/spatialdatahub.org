// this is the portal view specific javascript

// This file has all the basic map stuff, if there are specific functions
// for specific pages they will be in their own javascript files
// writen with ES6
// One thing I should do is to create a special ZMT icon with a ZMT popup that looks cool.
// should everything be wrapped in a dom ready function? At least I can use it instead of the jQuery function
// create base tile layer variables for map
// I am setting three as constants here
const osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">' +
  'OpenStreetMap</a>',
  minZoom: 2,
  maxZoom: 19
})
const stamenToner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/' +
'toner/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>,' +
  ' <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>' +
  ' &mdash; Map data &copy;' +
  ' <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 2,
  maxZoom: 19,
  ext: 'png'
})
const esriWorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/' +
'rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA,' +
  ' USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP,' +
  ' and the GIS User Community'
})

// set up map, view and base layer
const myMap = new L.Map('mapid', {
  center: {lat: 0, lng: 8.8460},
  zoom: 2,
  layers: osm,
  scrollWheelZoom: false
})

// create layer group and add base tile layers, then add it to the map
const baseLayers = {
  'Open Street Maps': osm,
  'Black and White': stamenToner,
  'ESRI World Map': esriWorldImagery
}
const baseLayerControl = L.control.layers(baseLayers)
baseLayerControl.addTo(myMap)

// toggle map scrollability
// save anonymous arrow function to variable
const scrollWheelToggle = () => {
  if (myMap.scrollWheelZoom.enabled()) {
    myMap.scrollWheelZoom.disable()
    console.log('no scroll!')
  } else {
    myMap.scrollWheelZoom.enable()
    console.log('scroll away!')
  }
}
myMap.on('click', scrollWheelToggle)

// I am going to bring the base_map javascript into this file, just like the
// javascript for the detailView

// maybe I should take this function out. It's somewhat extraneous.
/*
function mapToggler() {
  toggleDisplay("sidebar");
  main_map = document.getElementById("main_map");
  if (main_map.classList) {
    let classes = ["col-md-8"];
    main_map.classList.toggle(classes);
  } else {
    let classes = main_map.className.split(' '),
        existingIndex = classes.indexOf(className);
    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);
    main_map.className = classes.join(' ');
  }
}

domReady( () => {
  mapToggler();
});
*/

// make empty array to push datasets to
const datasets = []

// Get list of dataset checkbox items and the length of the list
const datasetCheckboxes = document.getElementsByName('datasetCheckbox')
const l = datasetCheckboxes.length

// push their values to the datasets array
// maybe it would be better to save this as an array of dictionaries, that way
// file extension could also be saved
for (let i = 0; i < l; i++) {
  const value = datasetCheckboxes[i].getAttribute('value')
  const ext = datasetCheckboxes[i].getAttribute('ext')
  datasets.push({'value': `ds${value}`, 'ext': ext})
}

// I feel like this should be refactored in a way that lets me re-use the code better
// add layers to variables stored in dataset list
const datasetToggle = (value, ext) => {
  const dsUrl = `/load_dataset/${value}`
  const dsValue = `ds${value}`
  const ds = datasets[dsValue]

// the function
  const onReadyPopups = () => {
    datasets[dsValue].eachLayer((layer) => {
      const popupContent = []
      for (const key in layer.feature.properties) {
        popupContent.push(
          `<b>${key}</b>: ${layer.feature.properties[key]}`
        )
      }
      if (layer.feature.geometry.type === 'Point') {
        popupContent.push(`<b>Latitude:</b> ${layer.feature.geometry.coordinates[1]}`)
        popupContent.push(`<b>Longitude:</b> ${layer.feature.geometry.coordinates[0]}`)
      }
      layer.bindPopup(popupContent.join('<br/>'))
    })
    let bounds = datasets[dsValue].getBounds()
    myMap.fitBounds(bounds)
  }

  // if map already has dataset, remove it, otherwise, add it
  if (myMap.hasLayer(ds)) {
    myMap.removeLayer(ds)
  } else {
    // would a switch statement be better
    switch (ext) {
      case 'kml':
        datasets[dsValue] = omnivore.kml(dsUrl)
        .on('ready', onReadyPopups)
        .addTo(myMap)
        break
      case 'csv':
        datasets[dsValue] = omnivore.csv(dsUrl)
        .on('ready', onReadyPopups)
        .addTo(myMap)
        break
      default:
        datasets[dsValue] = omnivore.geojson(dsUrl)
        .on('ready', onReadyPopups)
        .addTo(myMap)
        break
    }

    // use dataset.ext to get dataset type
    /*
    if (ext === "kml") {
      datasets[dsValue] = omnivore.kml(url=dsUrl)
      .on("ready", onReadyPopups)
      .addTo(myMap);
    } else if (ext === "csv") {
      datasets[dsValue] = omnivore.kml(url=dsUrl)
      .on("ready", onReadyPopups)
      .addTo(myMap);
    } else {
      datasets[dsValue] = omnivore.geojson(url=dsUrl)
      .on("ready", onReadyPopups)
      .addTo(myMap);
    }
    */
  }
}

for (let i = 0; i < datasetCheckboxes.length; i++) {
  datasetCheckboxes[i].addEventListener('click', (event) => {
    const value = event.target.value
    const ext = event.target.getAttribute('ext')
    datasetToggle(value, ext)
  })
}

// function clearAllLayers() {
//   myMap.eachLayer(function (layer) {
//     myMap.removeLayer(layer);
//   });
// }

/*
// there's potential to replace this with a fullscreen map button
// map resize button with id, for testing purposes
const mapResizeButton = L.easyButton({
  states: [{
    icon: "<i class='fa fa-arrows-h' aria-hidden='true'></i>",
    id: "mapResizeButton",
    onClick: function resizeMap(btn, myMap) {
      mapToggler();
    }
  }]
}).addTo(myMap);
*/
