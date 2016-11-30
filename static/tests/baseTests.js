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




QUnit.test("Change leaflet view with home button", function ( assert ) {
  // I have to move the map center before clicking the button or this doesn't test anything
  // this test is broken
  myMap.setView({lat: 3, lng: 3}, 4);

  $("mapCenterButton").trigger("click");

  assert.equal(
    myMap.getCenter().lat,
    3,
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


QUnit.test("Change leaflet view with home button", function ( assert ) {
  // I have to move the map center before clicking the button or this doesn't test anything
  // this test is broken
  myMap.setView({lat: 3, lng: 3}, 4);

//  $("mapCenterButton").trigger("click");


  assert.equal(
    myMap.getCenter().lat,
    3,
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


