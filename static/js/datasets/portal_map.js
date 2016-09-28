// One thing I should do is to create a special ZMT icon with a ZMT popup that looks cool.


// create base tile layer variable for map
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	minZoom:0, 
	maxZoom: 19 
}),
stamenToner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

// set up map, view and base layer
var myMap;
myMap = new L.Map('mapid', {
	center: {lat: 0, lng: 8.8460}, 
	zoom: 2,
	layers: osm 
});

// create layer group and add base tile layer to layer group
var baseLayers = {
	"Open Street Maps": osm,
	"Black and White": stamenToner
};
L.control.layers(baseLayers).addTo(myMap);

// create object to add datasets too
datasets = []; 

// add values from the html elements to the dataset list
// add "ds" to the numbers to that they can be called as variables
$("input#datasetCheckbox").each(function() {
	value = "ds"+$(this).val();
	datasets.push(value);
});


// add layers to variables stored in dataset list
// maybe I can use this function on the meta data page load. 
function datasetToggle( value ) {
	var dsUrl = "/load_dataset/" + value,
	dsValue = "ds" + value,
	ds = datasets[dsValue];

	// if map already has dataset, remove it, otherwise, add it
	if (myMap.hasLayer(ds)) {
		myMap.removeLayer(ds);	
	} else {
	// add if/then for kml/geojson/csv ... how do i check?
		//datasets[dsValue] = omnivore.kml(url=dsUrl);
		datasets[dsValue] = omnivore.geojson(url=dsUrl)
		.on('ready', function(){
			datasets[dsValue].eachLayer(function(layer){
				var popupContent = [];
				for (var key in layer.feature.properties) {
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
			myMap.fitBounds(datasets[dsValue].getBounds());			
		})
		.addTo(myMap);
	};
};



// call datasetToggle function on list item click
$("input#datasetCheckbox").on("click", function( event ) {
	var value = event.target.value
	datasetToggle( value );
});


// call datasetToggle function on page load for meta data page. 
// maybe this should just be added as a separate script to the page itself
//$(document).on(ready, function( pk )
//	datasetToggle( pk );
//});




//function clearAllLayers() {
//	myMap.eachLayer(function (layer) {
//		myMap.removeLayer(layer);
//	});
//}

// This button works to resize things, but the map is messed up when I use it.
// The map needs to be resized, or reinitiated, or something.
L.easyButton('<i class="fa fa-arrows-h" aria-hidden="true"></i>',
	function(btn, myMap) {
		$("#sidebar").toggle();
		$("#main_map").toggleClass("col-sm-6 col-md-8 col-lg-9");
		myMap._resetView(myMap.getCenter(), myMap.getZoom(), true);
	}
).addTo(myMap);
