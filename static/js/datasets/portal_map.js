// write with ES6
// changing var designations to use either let or const
// so far this seems to be working because I have written all of my variables to work
// within certain scopes. 

// are there other functions that I can write with ES6

// One thing I should do is to create a special ZMT icon with a ZMT popup that looks cool.


// create base tile layer variable for map
let osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  minZoom:0, 
  maxZoom: 19 
}),
stamenToner = L.tileLayer("http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}", {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: "abcd",
  minZoom: 0,
  maxZoom: 19,
  ext: "png"
});

// set up map, view and base layer
// is there any reason to make myMap a constant?
// I will give it a try, and see what happens I don't really want it to change, so... seems fine to me
const myMap = new L.Map("mapid", {
  center: {lat: 0, lng: 8.8460}, 
  zoom: 2,
  layers: osm 
});

// create layer group and add base tile layer to layer group
let baseLayers = {
  "Open Street Maps": osm,
  "Black and White": stamenToner
};

L.control.layers(baseLayers).addTo(myMap);

let datasets = []; 

// add values from the html elements to the dataset list
// add "ds" to the numbers to that they can be called as variables
// the arrow function doesn't work on the .each call because of an issue with the 'this' keyword
// and what it refers to.

$("input#datasetCheckbox").each( function() {
  let value = "ds"+$(this).val();
  datasets.push(value);
});


// add layers to variables stored in dataset list
// maybe I can use this function on the meta data page load. 
// is there any reason to use an ES6 arrow function over regular JS for this function?
// probably not, I will leave the original commented out

// function datasetToggle( value ) {
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
        // datasets[dsValue].eachLayer(function(layer){
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
//			var bounds = datasets[dsValue].getBoundsZoom();
//			myMap.fitBounds(bounds /*datasets[dsValue].getBounds()*/);
//				{ padding: [100,100] });			
      myMap.setView(datasets[dsValue].getBounds().getCenter());
    })
    .addTo(myMap);
  };
};


// call datasetToggle function on list item click
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

$(document).ready( () => {
  $("#sidebar").toggle();
  $("#main_map").toggleClass("col-sm-6 col-md-8 col-lg-9");
});


let mapResizeButton = L.easyButton('<i class="fa fa-arrows-h" aria-hidden="true"></i>',
  (btn, myMap) => {
    $("#sidebar").toggle();
    $("#main_map").toggleClass("col-sm-6 col-md-8 col-lg-9");
  }
).addTo(myMap);

// Here I need to start working on the slider bar, and the functionality for it.
