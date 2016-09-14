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
			.addTo(myMap);
	};
};

// call datasetToggle function on list item click
$("input#datasetCheckbox").on("click", function( event ) {
	var value = event.target.value
	datasetToggle( value );
});



// add layer providers to map 
// add pop-ups to GeoJson layers that display features. Does this need 
//to be part of the dataset button call?
// get the layer's properties


//function onEachFeature( feature, layer ) {
//	var popupContent = feature.geometry.type;
//	layer.bindPopup(popupContent);
//};

//function getLayer( value ) {
//	var layerClicked = omnivore.geojson(url = "/load_dataset/" + value)

//	.on('ready', function() {
//		onEachFeature()
//	})
//	.addTo(myMap);
//};

