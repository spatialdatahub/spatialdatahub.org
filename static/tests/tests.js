QUnit.test("map default options", function( assert ) { 
	assert.equal(myMap.getCenter().toString(),
		"LatLng(0, 8.846)",
		"The map is centered at the ZMT's longitude, and the equator"
	);

	assert.equal(myMap.getZoom(),
		2,
		"The default zoom is set to 2"
	);

	assert.equal(myMap.hasLayer(baseLayers['Open Street Maps']),
		true,
		"The default base layer is the open street maps tile layer"
	);	
});


QUnit.test("baseLayers variable", function( assert ) {
	assert.equal(Object.keys(baseLayers).length,
		2,
		"There are two key:value layers in 'baseLayers' variable"
	);

	assert.equal(baseLayers['Open Street Maps']._url,
		"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		"The url of the open street maps base layer is correct"
	);


	assert.equal(baseLayers['Black and White']._url,
		'http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}',
		"The url of the stamen black and white base layer is correct"
	);

	assert.equal(baseLayers['Open Street Maps'].options.attribution,
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		"The attribution for the open street maps layer is correct"
	);

	assert.equal(baseLayers['Black and White'].options.attribution,
		'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		"The attribution for the Stamen Toner Map layer is correct"
	);

	assert.equal(baseLayers['Open Street Maps'].options.minZoom,
		0,
		"The default minimum zoom on the open street maps layer is set to 0"
	);

	assert.equal(baseLayers['Black and White'].options.minZoom,
		0,
		"The default minimum zoom on the stamen toner layer is set to 0"
	);

	assert.equal(baseLayers['Open Street Maps'].options.maxZoom,
		19,
		"The default maximum zoom on the open street maps layer is set to 19"
	);

	assert.equal(baseLayers['Black and White'].options.maxZoom,
		20,
		"The default maximum zoom on the Stamen Black and White layer is set to 20"
	);
});


QUnit.test("dataToggle function turns layers on and off", function( assert ) {
	// for some strange reason this test seems to toggle on and off with page reloads
	// as in on initial page load it passes, and on the next it fails, then 
	// on the next it passes again, then back and forth and back and forth.
	var value1 = 13;
	var value2 = 5;	

	datasetToggle( value1 );
	assert.ok(myMap.hasLayer(datasets['ds13']),
		"checking to see if may has layer after datasetToggle called"
	);

	datasetToggle( value2 );
	assert.ok(myMap.hasLayer(datasets['ds5']),
		"checking to see if may has layer after datasetToggle called"
	);

	datasetToggle( value1 );
	assert.notOk(myMap.hasLayer(datasets['ds13']),
		"checking to see if may has layer after datasetToggle called"
	);

	datasetToggle( value2 );
	assert.notOk(myMap.hasLayer(datasets['ds5']),
		"checking to see if may has layer after datasetToggle called"
	);
});


QUnit.test("add dummy GeoJSON to datasets layer", function( assert ) {
	// add GeoJSON dataset to map with jQuery ajax call
	// there is no longer a datasets layer
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

