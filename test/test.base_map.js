// Base Map Tests
// I need to mock some html elements, but i am apparently not doing it right.
//var mapid = document.createElement('div');
//mapid.setAttribute("id", "mapid");


// while i do not want to have special code in my test suite, I want to simulate a click event


// Base Map Tests
describe('The base_map.js tests', function() {

  // Open Street Maps Background 
  describe('The Open Street Maps variable (osm)', function() {
    it('should call the correct url', function() {
      assert.equal(osm._url, "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    });

    var expected_attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    it('should have the correct attribution', function() {
      assert.equal(osm.options.attribution, expected_attribution);
    });

    it('should have a minimum zoom of 2', function() {
      assert.equal(osm.options.minZoom, 2);
    });

    it('should have a maximum zoom of 19', function() {
      assert.equal(osm.options.maxZoom, 19);
    });
  });

  // Stamen Toner Background 
  describe('The Stamen Toner variable (stamenToner)', function() {
    it('should call the correct url', function() {
      assert.equal(
        stamenToner._url,
        "http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}"
      );
    });

    var expected_attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    it('should have the correct attribution', function() {
      assert.equal(stamenToner.options.attribution, expected_attribution);
    });

    it('should have a minimum zoom of 2', function() {
      assert.equal(stamenToner.options.minZoom, 2);
    });

    it('should have a maximum zoom of 19', function() {
      assert.equal(stamenToner.options.maxZoom, 19);
    });
  });

   // ESRI World Imagery
  describe('The Esri World Imagery variable (Esri_WorldImagery)', function() {
    it('should call the correct url', function() {
      assert.equal(
        Esri_WorldImagery._url,
        "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      );
    });

  var expected_attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    it('should have the correct attribution', function() {
      assert.equal(Esri_WorldImagery.options.attribution, expected_attribution);
    });

    it('should have a minimum zoom of 0', function() {
      assert.equal(Esri_WorldImagery.options.minZoom, 0);
    });

    it('should have a maximum zoom of 18', function() {
      assert.equal(Esri_WorldImagery.options.maxZoom, 18);
    });
  });

  // baseLayers variable test
  describe('baseLayers variable test', function(){
    it('should have the correct number of layer variables', function() {
      assert.equal(Object.keys(baseLayers).length, 3);
    });
  });

  // Map Default Options
  describe('Map default options', function() {
    it('should set the default latitude to the equator (0)', function(){
      assert.equal(myMap.options.center.lat, 0);
    });

    it('should set the default longitude to the longitude of the ZMT (8.846)', function() {
      assert.equal(myMap.options.center.lng, 8.846);
    });

    it('should set the default zoom to 2', function() {
      assert.equal(myMap.options.zoom, 2);
    });

    it('should set the default layer for the map to the Open Street Maps layer', function() {
      assert.equal(myMap.options.layers, osm);
    });
  });

// Map Scroll Toggle
  describe('Map scrollWheelToggle', function() {

    describe('Map scrollWheelToggle default', function() {

      it('should be set to "scrollWheelZoom = false" on page load', function() {
        assert.equal(myMap.options.scrollWheelZoom, false);
      });

    });

    describe('Map scrollWheelToggle call', function() {

//      before(function() { scrollWheelToggle(); });
//      after(function() { scrollWheelToggle(); });

      it('should toggle the map scrollability on and off when the function is called', function() {
        assert.equal(myMap.options.scrollWheelZoom, true);
      });

    });

  });

});
