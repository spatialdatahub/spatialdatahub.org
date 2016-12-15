var assert = chai.assert;


// portalView Javascript Tests
describe('The portalView.js tests', function() {

  describe('The mapToggler() function',
    function() {
      describe(`For the sidebar element; 
                for this test suite "mapToggler()" is called before and after both tests,
                and it is called once more at the end.`, function() {

        beforeEach(function() { mapToggler(); });
        afterEach(function() { mapToggler(); });
        after(function() { mapToggler(); });

        let sidebar = document.getElementById("sidebar");

        it('should have the "sidebar" display equal to an empty string', function() {
          assert.equal(sidebar.style.display, "");
        });

        it('should set the "sidebar" display equal to "none" when called', function() {
          mapToggler();
          assert.equal(sidebar.style.display, "none");
        });
      });

      describe(`For the main_map element;
                for this test suite "mapToggler()" is called before and after both tests,
                and it is called once more at the end.`, function() {

        beforeEach(function() { mapToggler(); });
        afterEach(function() { mapToggler(); });
        after(function() { mapToggler(); });

        let main_map = document.getElementById("main_map");

        it('should have the "main_map" bootstrap class be equal to "col-md-8"',
        function() {
          assert.equal(main_map.classList, (""));
        });

        it('should have the "main_map" bootstrap class be equal to "col-md-8"',
        function() {
          mapToggler();
          assert.equal(main_map.classList, ("col-md-8"));
        });

      });

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

  describe('Datatypes that can be added to the map', function() {

  });

});

//  describe('The mapResizeButton', function() {

//    let mapResizeButton = document.getElementById('mapResizeButton');
 //   console.log(mapResizeButton);

//    it("should call the mapToggler() function", function() {
//      var event = document.createEvent('click');
//      mapResizeButton.dispatchEvent(event);
//      assert(spy.called);
//    });


 //   it("should probably be a different function");
  //});



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
  



    });
  });
});
*/
