// create base tile layer variable for map
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	minZoom:0, 
	maxZoom: 19 
});


// create layer group and add base tile layer to layer group
var baseLayer = L.layerGroup();
baseLayer.addLayer(osm);


// set up map, view and base layer
var myMap;
myMap = new L.Map('mapid', {
	center: {lat: 0, lng: 8.8460}, 
	zoom: 2,
	layers: baseLayer
});


// add layer providers to map 


// create layer group to add datasets too
var datasets = L.layerGroup();


// add pop-ups to GeoJson layers that display features. Does this need to be part of the dataset button call?
// get the layer's properties
function onEachFeature( feature, layer ) {
//	var popupContent = feature.geometry.type;
//	if (feature.properties && feature.properties.popupContent) {
//		popupContent += feature.properties.popupContent;
//	}
	layer.bindPopup('popup');
};


// allow layers to be turned on and off with jQuery and own buttons

// I want to add the dataset layer to the map, but maybe this is uneccesasry... how do i do this better?
//			datasets.addLayer( data );
//			datasets.addTo(myMap);


// right now this adds a layer to the map, but how do I remove the layer?
$('.dataset-button').on('click', function( value ) {
	value = $(this).attr('value');
	$.ajax({
		url:"/ajax/load_dataset/" + value,
		success: function( data ) {
			L.geoJson($.parseJSON(data), {
				onEachFeature: onEachFeature
			}).addTo(myMap);
		}
	});
});


// allow layers to be turned on and off with jQuery and own buttons


