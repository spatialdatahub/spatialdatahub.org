// this is the portal view specific javascript

// how do i write the toggle function myself? Maybe a problem for another time
// does it matter whether this shows up first in the document?
domReady( () => {
  $("#sidebar").toggle();
  $("#main_map").toggleClass("col-sm-6 col-md-8 col-lg-9");
});



// make empty array to push datasets to
const datasets = []; 



// add values from the html elements to the dataset list
// add "ds" to the numbers to that they can be called as variables
$("input#datasetCheckbox").each( function() {
  let value = "ds"+$(this).val();
  datasets.push(value);
});



// add layers to variables stored in dataset list
const datasetToggle = value => {
  let dsUrl = "/load_dataset/" + value,
  dsValue = "ds" + value,
  ds = datasets[dsValue];

    // if map already has dataset, remove it, otherwise, add it
    if (myMap.hasLayer(ds)) {
      myMap.removeLayer(ds);	
    } else {

    // add if/then for kml/geojson/csv ... how do i check?
    //datasets[dsValue] = omnivore.kml(url=dsUrl);
      datasets[dsValue] = omnivore.geojson(url=dsUrl)
      .on('ready', () => {
        datasets[dsValue].eachLayer( (layer) => {
          let popupContent = [];
          for (let key in layer.feature.properties) {
            popupContent.push(
              "<b>" + key + "</b>" + ": " + layer.feature.properties[key]
            );
          }

          if (layer.feature.geometry.type === "Point") {
            popupContent.push("<b>Latitude:</b> " + layer.feature.geometry.coordinates[1]);
            popupContent.push("<b>Longitude:</b> " + layer.feature.geometry.coordinates[0]);
          }
          layer.bindPopup(popupContent.join("<br/>"));
        });

// this section is a bit buggy.
// var bounds = datasets[dsValue].getBoundsZoom();
// myMap.fitBounds(bounds /*datasets[dsValue].getBounds()*/);
//{ padding: [100,100] });			

      myMap.setView(datasets[dsValue].getBounds().getCenter());
    })
    .addTo(myMap);
  };
};



// call datasetToggle function on list item click
// is there a way to do this without jquery? it probably doesn't matter too
// much
$("input#datasetCheckbox").on("click", ( event ) => {
  let value = event.target.value
  datasetToggle( value );
});


/*
// de-jQuery this thing

let datasetCheckbox = document.getElementById("datasetCheckbox");

// datasetCheckbox.addEventListener("click", ( event ) => {
datasetCheckbox.addEventListener("click", function ( event ) {
// $("input#datasetCheckbox").on("click", ( event ) => {
  console.log(this);
  let value = event.target.value
  datasetToggle( value );
});
*/



//function clearAllLayers() {
//	myMap.eachLayer(function (layer) {
//		myMap.removeLayer(layer);
//	});
//}



// map resize button with id, for testing purposes
const mapResizeButton = L.easyButton({
  states: [{
    icon: '<i class="fa fa-arrows-h" aria-hidden="true"></i>',
    id: 'mapResizeButton',
    onClick: function resizeMap(btn, myMap) {
      $("#sidebar").toggle();
      $("#main_map").toggleClass("col-sm-6 col-md-8 col-lg-9");
    }
  }]
}).addTo(myMap);



