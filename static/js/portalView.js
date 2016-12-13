// this is the portal view specific javascript

// maybe I should take this function out. It's somewhat extraneous.
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


// make empty array to push datasets to
const datasets = []; 

// Get list of dataset checkbox items and the length of the list
let datasetCheckboxes = document.getElementsByName("datasetCheckbox"),
l = datasetCheckboxes.length;

// push their values to the datasets array
// maybe it would be better to save this as an array of dictionaries, that way
// file extension could also be saved
for (let i = 0; i < l; i++) {
  let value = datasetCheckboxes[i].getAttribute("value"),
  ext = datasetCheckboxes[i].getAttribute("ext");
  datasets.push({"value": `ds${value}`, "ext": ext}); 
}

/*
function onReadyPopups() {
  datasets[dsValue].eachLayer( (layer) => {
    let popupContent = [];
    for (let key in layer.feature.properties) {
      popupContent.push(
        `<b>${key}</b>: ${layer.feature.properties[key]}`
      );
    }
    if (layer.feature.geometry.type === "Point") {
      popupContent.push(`<b>Latitude:</b> ${layer.feature.geometry.coordinates[1]}`);
      popupContent.push(`<b>Longitude:</b> ${layer.feature.geometry.coordinates[0]}`);
    }
    layer.bindPopup(popupContent.join("<br/>"));
  });
  let bounds = datasets[dsValue].getBounds();
  myMap.fitBounds(bounds);
}
*/


// I feel like this should be refactored in a way that lets me re-use the code better
// add layers to variables stored in dataset list
const datasetToggle = (value, ext) => {
  let dsUrl = `/load_dataset/${value}`,
    dsValue = `ds${value}`,
    ds = datasets[dsValue];
    console.log(ds);

  function onReadyPopups() {
    datasets[dsValue].eachLayer( (layer) => {
      let popupContent = [];
      for (let key in layer.feature.properties) {
        popupContent.push(
          `<b>${key}</b>: ${layer.feature.properties[key]}`
        );
      }
      if (layer.feature.geometry.type === "Point") {
        popupContent.push(`<b>Latitude:</b> ${layer.feature.geometry.coordinates[1]}`);
        popupContent.push(`<b>Longitude:</b> ${layer.feature.geometry.coordinates[0]}`);
      }
      layer.bindPopup(popupContent.join("<br/>"));
    });
    let bounds = datasets[dsValue].getBounds();
    myMap.fitBounds(bounds);
  }

  // if map already has dataset, remove it, otherwise, add it
  if (myMap.hasLayer(ds)) {
    myMap.removeLayer(ds);	
  } else {
  
    // use dataset.ext to get dataset type    
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

  };
};


for (let i = 0; i < datasetCheckboxes.length; i++) {
  datasetCheckboxes[i].addEventListener("click", ( event ) => {
    let value = event.target.value,
    ext = event.target.getAttribute('ext');
    datasetToggle( value, ext ); 
    console.log(ext);
  });
}




//function clearAllLayers() {
//	myMap.eachLayer(function (layer) {
//		myMap.removeLayer(layer);
//	});
//}


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
