QUnit.test("map default options", function( assert ) { assert.equal(myMap.getCenter().toString(),
		"LatLng(0, 8.846)",
		"The map is centered at the ZMT's longitude, and the equator"
	);
	assert.equal(myMap.getZoom(),
		2,
		"The default zoom is set to 2"
	);
});

QUnit.test("baseLayer layerGroup", function( assert ) {
	assert.equal(baseLayer.getLayers().length,
		1,
		"There is just one layer in 'baseLayer' layerGroup"
	);
	assert.equal(baseLayer.getLayers()[0]._url,
		"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		"The url of the layer leads to the correct openstreet map tiles"
	);
	assert.equal(baseLayer.getLayers()[0].options.attribution, 
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		"The attribution for the layer is correct"
	);
	assert.equal(baseLayer.getLayers()[0].options.minZoom,
		0,
		"The default minimum zoom is set to 0"
	);
	assert.equal(baseLayer.getLayers()[0].options.maxZoom,
		19,
		"The default maximum zoom is set to 19"
	);
});


QUnit.test("jQuery button can make ajax call that brings in datasets", function( assert ) {
	assert.expect( 2 );
	var $datasetButton =  $('.dataset-button');

	// Test click function
	$datasetButton.on("click", function() {
		assert.ok( true, "body was clicked!" );
	}); 


	// Why isn't there anything new here?
	$datasetButton.on("click", function() {
		assert.ok( true, "body was clicked!" );
	});

	$datasetButton.trigger( "click" );
});


QUnit.test("add dummy GeoJSON to datasets layer", function( assert ) {
	// add GeoJSON dataset to map with jQuery ajax call
	datasets.addLayer(geoJsonFeature);

	// make assertions
	assert.equal(datasets.getLayers().length,
		1,
		"One layer has been added to the datasets layer group"
	);
	assert.equal(datasets.getLayers()[0].properties.name,
		"Leibniz-Zentrum für Marine Tropenökologie",
		"Dataset name (ZMT) is correct"
	);

	assert.equal(datasets.getLayers()[0].geometry.type,
		"Point",
		"The dataset is a point layer"
	);
	assert.equal(String(datasets.getLayers()[0].geometry.coordinates),
		"8.846278,53.108312",
		"The coordinates are for the ZMT longitude: 8.846, latitude: 53.108"
	);
});


//QUnit.test("autoload dataset to detail/update pages", function( assert ) {
	// this is testing the same functionality as the button dataset add dataset,
	// but it's automatic. I probably need to do some refactoring relatively soon.
//}); 

//QUnit.test("Use Ajax call to bring GeoJson data in and add data to datasets layerGroup", function( assert ) {});

//QUnit.test("Can add and remove, or activate and deactivate, dataset on map", function( assert ) {});

//QUnit.test("Can use leaflet providers to bring in map tile layers and put them on the map", function( assert ) {});

//QUnit.test("Can click on data points and get popup with information about point", function( assert ) {
	// add GeoJSON dataset to map with jQuery ajax call
//	datasets.addLayer(rB);


//});

//QUnit.test("Slider bar", function( assert ) {});

//QUnit.test("KML files", function( assert ) {});

