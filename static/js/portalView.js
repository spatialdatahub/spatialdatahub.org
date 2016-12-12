// this is the portal view specific javascript


// Toggling the display and toggling the classes here.
// This is now de-jQueried
// I should name this function so that I can call it on the button press down below, 
// then this whole file will be almost de-jQueried


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
for (let i = 0; i < l; i++) {
  let value = datasetCheckboxes[i].getAttribute("value");
  datasets.push(`ds${value}`); 
}

// add layers to variables stored in dataset list
const datasetToggle = value => {
  let dsUrl = `/load_dataset/${value}`,
  dsValue = `ds${value}`,
  ds = datasets[dsValue];

  // if map already has dataset, remove it, otherwise, add it
  if (myMap.hasLayer(ds)) {
    myMap.removeLayer(ds);	
  } else {

  // add if/then for kml/geojson/csv ... how do i check?
  //datasets[dsValue] = omnivore.kml(url=dsUrl);
    datasets[dsValue] = omnivore.geojson(url=dsUrl)
    .on("ready", () => {
      datasets[dsValue].eachLayer( (layer) => {
        console.log(layer);
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
    })
    .addTo(myMap);
  };
};


for (let i = 0; i < datasetCheckboxes.length; i++) {
  datasetCheckboxes[i].addEventListener("click", ( event ) => {
    let value = event.target.value;
    datasetToggle( value ); 
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
