function isEven(val) {
	return val % 2 === 0;
}

QUnit.test("isEven()", function( assert ) {
	assert.ok(isEven(0), 'Zero is an even number');
	assert.ok(!isEven(1), 'one is not an even number');
	assert.ok(isEven(2), 'two is an even number');
	assert.ok(isEven(-2), 'negative two is an even number');
});

QUnit.test("Is the map center in the correct place?", function( assert ) {
	assert.equal(myMap.getCenter().toString(), 'LatLng(0, 8.846)');
});

QUnit.test("Is the base map layer correct", function( assert ) {
	assert.equal(myMap.getLayers(), 'LatLng(0, 8.846)');
});
