// Dom Ready Tests
// How do I test this code?
/* define DOM ready function
const domReady = function(callback) {
  document.readyState === "interactive" ||
  document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};
*/

// These tests will need to be more loosely coupled in the future, but right
// they are good to start with.

// Base Map File Tests
QUnit.test("base_map.js osm variable tests", function( assert ) {

  // Open Street Maps 
  assert.equal(
    osm._url, 
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "The osm base layer calls the correct url"
  );

  let attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  assert.equal(
    osm.options.attribution, 
    attribution,
    "The osm base layer has the correct attribution"
  );

  assert.equal(
    osm.options.minZoom,
    0,
    "The osm base layer has the correct minimum zoom" 
  );

  assert.equal(osm.options.maxZoom,
    19,
    "The osm base layer has the correct maximum zoom" 
  );
});


QUnit.test("base_map.js stamenToner variable tests", function( assert ) {

  // Stamen Black and White
  assert.equal(
    stamenToner._url, 
    "http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}",
    "The stamenToner base layer calls the correct url"
  );

  let attribution= 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  assert.equal(
    stamenToner.options.attribution, 
    attribution,
    "The stamenToner base layer has the correct attribution"
  );

  assert.equal(
    stamenToner.options.minZoom,
    0,
    "The stamenToner base layer has the correct minimum zoom" 
  );

  assert.equal(stamenToner.options.maxZoom,
    stamenToner.options.maxZoom,
    19,
    "The stamenToner base layer has the correct maximum zoom" 
  );
});


QUnit.test("base_map.js Esri_WorldImagery (satellite view) variable tests", function( assert ) {

  // Esri World Imagery
  assert.equal(
    Esri_WorldImagery._url,
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    "The ESRI Satellite base layer calls the correct url"
  );

  let attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
  assert.equal(
    Esri_WorldImagery.options.attribution, 
    attribution,
    "The osm base layer has the correct attribution"
  );
});


QUnit.test("baseLayers variable tests", function ( assert ) {
  // this is probably too forcefully cementing the site together. It will have to change, but at least
  // I will know when things change with this here. It's a good check point.
  assert.equal(
    Object.keys(baseLayers).length,
    3,
    "Making sure that there are the correct number of layers in the base layer variable"
  );

});


QUnit.test("map default options", function( assert ) { 

  assert.equal(
    myMap.options.center.lat,
    0,
    "The map's default latitude is the equator (0)"
  );

  assert.equal(
    myMap.options.center.lng,
    8.846,
    "The map's default longitude is the longitude of the ZMT (8.846)"
  );

  assert.equal(
    myMap.options.zoom,
    2,
    "The default zoom is set to 2"
  );

  assert.equal(
    myMap.options.layers,
    osm,
    "The default layer for the map is the Open Street Maps layer"
  );
});


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




QUnit.test("Change div width on leaflet control button press", function( assert ) {
	assert.expect(1);

	$mapResizeButton.on("click", function() {
		assert.ok($("div.sidebar").hasClass("col-xs-0"),
		"minimizing the sidebar into nothingness"
		);
	});

	$mapResizeButton.trigger("click");
});


QUnit.test("Change leaflet view with home button", function ( assert ) {
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

});

QUnit.test("Change dive class with leaflet map enlarge button push", function ( assert ) {
  $("mapResizeButton").trigger("click");

  let sidebar = document.getElementById("sidebar"),
  main_map = document.getElementById("main_map");
  assert.equal(
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


