// this is the portal view specific javascript

// make empty array to push datasets to
const datasets = []; 

// add values from the html elements to the dataset list
// add "ds" to the numbers to that they can be called as variables
// the arrow function doesn't work on the .each call because of an issue with the 'this' keyword
// and what it refers to.

$("input#datasetCheckbox").each( function() {
  let value = "ds"+$(this).val();
  datasets.push(value);
});

// add layers to variables stored in dataset list

let datasetToggle = value => {
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

//function clearAllLayers() {
//	myMap.eachLayer(function (layer) {
//		myMap.removeLayer(layer);
//	});
//}

// Loading the map at full browser size AND THEN adding the column size options
// Of course now when I load stuff to the map, some of it is off screen with the zoom.
// So, this thing is a bit buggy and needs some work, but the basic functionality is there.
// Also, I will need to either make this specific to different pages or change the pages css
// settings.

// Also, does this need to be loaded in every page?
// I don't want to rewrite a bunch of code, but maybe I should just have a
// bunch of functions and variables defined in one js file and a bunch of stuff
// for specific pages in their own files.

$(document).ready( () => {
  $("#sidebar").toggle();
  $("#main_map").toggleClass("col-sm-6 col-md-8 col-lg-9");
});

const mapResizeButton = L.easyButton('<i class="fa fa-arrows-h" aria-hidden="true"></i>',
  (btn, myMap) => {
    $("#sidebar").toggle();
    $("#main_map").toggleClass("col-sm-6 col-md-8 col-lg-9");
  }
).addTo(myMap);

// Add a map center button

const mapCenterButton = L.easyButton('fa-home', 
  (btn, myMap) => {
    myMap.setView([0, 8.8460], 2);
  }
).addTo(myMap);


