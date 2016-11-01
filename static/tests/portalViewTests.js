// Portal View Javascript Tests

QUnit.test('test datasets list creation function', function ( assert ) {
  assert.equal(
    datasets.length,
    2,
    'this should automatically be populated with dataset keys'
  );

  assert.equal(
    datasets[0],
    'ds1',
    `the name of the first dataset key, which is \"${datasets[0]}\"`
  );
});


QUnit.test('test datasetToggle function', function ( assert ) {


});

QUnit.test("On document ready main map and sidebar elements have correct bootstrap classes", function( assert ) {

  let sidebar = document.getElementById("sidebar"),
  main_map = document.getElementById("main_map");

  assert.equal(
    main_map.getAttribute("class"),
    "col-sm-6 col-md-8 col-lg-9", 
    "jQuery appends different bootstrap class to div on page load"
  );

  assert.notEqual(
    sidebar.getAttribute("style"),
    "display: none;",
    "jQuery toggles the display status of the sidebar element"
  );

});

QUnit.test("Change div class with leaflet map enlarge button push", function ( assert ) {

  // I am having trouble getting a hold of the function
  // this may be something that I have to do with a functional test

  let sidebar = document.getElementById("sidebar"),
  main_map = document.getElementById("main_map"),
  mapResizeButton = document.getElementById("mapResizeButton");

  mapResizeButton.trigger("click");

  assert.equal(
    main_map.getAttribute("class"),
    "col-sm-6 col-md-8 col-lg-9", 
    "jQuery toggles class on button push"
  );

  assert.notEqual(
    sidebar.getAttribute("style"),
    "display: none;",
    "jQuery toggles the display status of the sidebar element"
  );

});


QUnit.test("Change leaflet view with home button", function ( assert ) {
  // I have to move the map center before clicking the button or this doesn't test anything
  myMap.setView({lat: 3, lng: 3}, 4);

  $("mapCenterButton").trigger("click");

  assert.equal(
    myMap.getCenter().lat,
    0,
    "Map is centered on home button click"
  );

  assert.equal(
    myMap.getCenter().lng,
    8.846,
    `The home button makes the map's longitude is
the longitude is the longitude of the ZMT (8.846)`
  );

  assert.equal(
    myMap.getZoom(),
    2,
    "The home button makes the map's zoom 2" 
  );
});




/*
Test asynchronous calls for datasets
*/

/*
Test that popup windows are in the format that we want
*/

/*
Test map resize button
*/

/*
Test that map resize button reloads map to entire window on resize
*/

/*
Test map resize button
*/






/*
QUnit.test("whatever", function( assert ) {

	datasetToggle( 22 );
	assert.ok(myMap.hasLayer(datasets['ds22']),' alles gut');

	assert.equal(datasets['ds22'].eachLayer(function(layer){
		layer.feature.geometry.coordinates})[1],
		[-157.950439453125, 21.468405577312012],
		"This should work."
	);
});


QUnit.test("multiple async calls", function( assert ) {
	assert.expect(2);
	var done = assert.async(2);
	datasetToggle(11);

	setTimeout(function() {
		assert.ok( myMap.hasLayer(datasets['ds11'], 'map has layer there'));
		done();
	}, 1000);

	setTimeout(function() {
		assert.ok( myMap.hasLayer(datasets['ds11'], 'map has layer there'));
		done();
	}, 1000);

});
*/


/*
QUnit.test("dataToggle function turns layers on and off", function( assert ) {
	assert.expect(2);

	// I have to do this asynchronously
	var value1 = 22;
	var done1 = assert.async();
	var done2 = assert.async();

	// call function
	datasetToggle( value1 );

	// check that myMap has layer
	setTimeout(function() {
		assert.ok(myMap.hasLayer(datasets['ds22']),
			"checking to see if map has layer after datasetToggle called"
		);
		done1();
	});

	// check that layer can be queried for coordinates
	// it seems like this is pulling in more than one result

	setTimeout(function() {
		assert.equal(datasets['ds22'].eachLayer(function(layer){
			layer.feature.geometry.coordinates})[0],
			[-157.950439453125, 21.468405577312012],
			"This should work."
		);
		done2();
//		datasetToggle( value1 );
//		assert.notOk(myMap.hasLayer(datasets['ds22']),
//			"checking to that layer is not on map after datasetToggle called a second time"
//		);
//		done();
	});
});

/*
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
*/

