QUnit.test("map's center is in the correct place?", function( assert ) {
	assert.equal(myMap.getCenter().toString(), "LatLng(0, 8.846)");
});

QUnit.test("map's zoom is correct?", function( assert ) {
	assert.equal(myMap.getZoom(), 2);
});

console.log(baseLayer());

QUnit.test("check baseLayer layerGroup", function( assert ) {
	assert.equal(baseLayer().getLayers().length, 1);
});

QUnit.test("base layer (osm) URL is correct", function( assert ) {
	assert.equal(osm._url, "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
});

QUnit.test("base layer (osm) attribution is correct", function( assert ){
	assert.equal(osm.options.attribution, 
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>');
});

QUnit.test("base layer (osm) minZoom is correct", function( assert ){
	assert.equal(osm.options.minZoom, 0);
});

QUnit.test("base layer (osm) maxZoom is correct", function( assert ){
	assert.equal(osm.options.maxZoom, 19);
});

QUnit.test("add dummy GeoJSON to map", function( assert ){

});
