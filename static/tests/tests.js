QUnit.test("Test that the map's center is in the correct place?", function( assert ) {
	assert.equal(myMap.getCenter().toString(), "LatLng(0, 8.846)");
});

QUnit.test("Test that the map's zoom correct?", function( assert ) {
	assert.equal(myMap.getZoom(), 2);
});

QUnit.test("Test base layer (osm) URL", function( assert ) {
	assert.equal(osm._url, "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
});

QUnit.test("Test base layer (osm) attribution?", function( assert ){
	assert.equal(osm.options.attribution, 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>');
});

QUnit.test("Test base layer (osm) minZoom?", function( assert ){
	assert.equal(osm.options.minZoom, 0);
});

QUnit.test("Test base layer (osm) maxZoom?", function( assert ){
	assert.equal(osm.options.maxZoom, 18);
});
