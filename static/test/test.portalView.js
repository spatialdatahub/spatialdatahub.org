var assert = chai.assert;

// portalView Javascript Tests
describe('The portalView.js tests', function() {

  describe('The mapToggler() function', function() {

    it('should have the "sidebar" display equal to an empty string');

    it('should have the "main_map" bootstrap class be equal to "col-12 col-sm-12 col-md-8"');

  });

  describe('The datasets list creation function', function() {

    it('should be already populated with dataset keys', function() {
      assert.equal(datasets.length, 3);
    });

    it(`should have the first dataset key's name be in the format of
       "ds${datasetCheckboxes[0].value}"`, function() {
      assert.equal(datasets[0], `ds${datasetCheckboxes[0].value}`);
    });

  });

  describe('The datasetToggle function', function() {
    // this test will probably only work if i access the app's true database.
    // I will do this until I find a better way.

    // toggle dataset with pk value 1 on and off with every test.
    beforeEach(function() { datasetToggle(datasetCheckboxes[0].value); }); 
    afterEach(function() { datasetToggle(datasetCheckboxes[0].value); }); 

    it("should be able to bring geojson datasets in");
    it("should be able to bring kml datasets in");
    it("should be able to bring the csv datasets in");
    it("should use save each layer's properties to a popupContent variable");
    it("should use save each layer's coordinates to a popupContent variable");
    it("should fit the map's bounds to the the dataset's bounds");
    it("should add and remove each dataset from the map");
  });

  describe('The mapResizeButton', function() {
    it("should call the mapToggler() function");
    it("should probably be a different function");
  });
});



/*
    // Mock the datasetCheckbox inputs
//    var datasetCheckbox_1 = document.createElement(
 //       `input`),
  //      datasetCheckbox_2 = document.createElement(
   //       `input`
    //    );

//    datasetCheckbox_1.setAttribute('name', 'datasetCheckbox');
//    datasetCheckbox_1.setAttribute('value', 1);

//    datasetCheckbox_2.setAttribute('name', 'datasetCheckbox');
//    datasetCheckbox_2.setAttribute('value', 2);
  

    it('should automatically be populated with dataset keys', function() {
      assert.equal(datasets.length, 2);
    });

    it(`should have the name of the first dataset key as "${datasets[0]}"`, function() {
      assert.equal(datasets[0], 'ds1'); 
    });
  });


  describe(`On document ready main map and sidebar elements should 
            have the correct bootstrap classes`, function(){

    let sidebar = document.getElementById("sidebar"),
    main_map = document.getElementById("main_map");


  describe(`On document ready main map and sidebar elements should 
            have the correct bootstrap classes`, function(){
    let sidebar = document.getElementById("sidebar"),
    main_map = document.getElementById("main_map");
    it('jQuery should append different bootstrap class to div on page load', function() {
      assert.equal(main_map.getAttribute('class'), 'col-sm-6 col-md-8 col-lg-9');
    });

    it('jQuery toggles the display status of the sidebar element', function() {
      assert.notEqual(sidebar.getAttribute('style'), 'display: none;');
    });
  });
});
*/
