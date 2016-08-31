QUnit.test("map default options", function( assert ) {
	assert.equal(myMap.getCenter().toString(),
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


QUnit.test("add dummy GeoJSON to map", function( assert ){
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


