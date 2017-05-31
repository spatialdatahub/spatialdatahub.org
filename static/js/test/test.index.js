'use strict';

describe('Tests for the functions in the index.js', function () {
  // this should probably be removed... it's not an important function
  describe('dataToDiv', function () {
    it('is used to add data to html elements, or anything really', function () {
      var div = document.createElement('div');
      var data = 'hey';
      dataToDiv(data, div);
      assert.equal(div.innerHTML, 'hey');
    });
  });

  describe('classToggle', function () {
    it('should add the class "super"', function () {
      var div = document.createElement('div');
      div.className = '';
      classToggle(div, 'super');
      assert.equal(div.className, 'super');
    });

    it('should remove the class "super"', function () {
      var div = document.createElement('div');
      div.className = 'super';
      classToggle(div, 'super');
      assert.equal(div.className, '');
    });
  });

  describe('classToggleOnDiffLink', function () {
    describe('when divs do not have targeted class', function () {
      var div1 = document.createElement('div');
      var div2 = document.createElement('div');
      div1.className = '';
      div2.className = '';
      var classes = [div1, div2];
      classToggleOnDiffLink(div1, classes, 'super');

      it('should add the class "super" to div1', function () {
        assert(div1.className.includes('super'), 'assert the className includes "super"');
      });

      it('should not add the class "super" to div2', function () {
        assert.equal(div2.className, '');
      });
    });

    describe('when one of the divs has the targeted class', function () {
      var div1 = document.createElement('div');
      var div2 = document.createElement('div');
      div1.className = 'super';
      div2.className = '';
      var classes = [div1, div2];
      classToggleOnDiffLink(div2, classes, 'super');

      it('should remove the class "super" from div1', function () {
        assert.equal(div1.className, '');
      });

      it('should add the class "super" to div2', function () {
        assert(div2.className.includes('super'), 'assert the className includes "super"');
      });
    });
  });

  describe('getExt', function () {
    describe('is used to get a specific extension from the end of a string', function () {
      it('should recognize "kml"', function () {
        var string = 'something.kml';
        assert.equal(getExt(string), 'kml');
      });

      it('should recognize "csv"', function () {
        var string = 'something.csv';
        assert.equal(getExt(string), 'csv');
      });

      it('should recognize "json", but return "geojson"', function () {
        var string = 'something.json';
        assert.equal(getExt(string), 'geojson');
      });

      it('should recognize "geojson"', function () {
        var string = 'something.geojson';
        assert.equal(getExt(string), 'geojson');
      });

      it('should convert uppercase to lowercase', function () {
        var string = 'something.GEOJSON';
        assert.equal(getExt(string), 'geojson');
      });
    });
  });

  describe('addButton', function () {
    describe('is used to add a button with a specific color to a container', function () {
      it('should add a button element to the container', function () {
        var div = document.createElement('div');
        addButton('hey', 'blue', div);
        assert.equal(div.children.item(0).tagName, 'BUTTON');
      });

      it('should make the button text "hey"', function () {
        var div = document.createElement('div');
        addButton('hey', 'blue', div);
        assert.equal(div.children.item(0).innerHTML, 'hey');
      });

      it('should make the button text color blue', function () {
        var div = document.createElement('div');
        addButton('hey', 'blue', div);
        assert.equal(div.children.item(0).style.color, 'blue');
      });

      it('should make the button text font weight bold', function () {
        var div = document.createElement('div');
        addButton('hey', 'blue', div);
        assert.equal(div.children.item(0).style.fontWeight, 'bold');
      });
    });
  });

  describe('makeReq', function () {
    describe('Is used to get data from a url, then pass it to a function that does something with a div', function () {

      var geojson = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"marker-color":"#7e7e7e","marker-size":"medium","marker-symbol":"","island":"oahu","largest-city":"honolulu"},"geometry":{"type":"Point","coordinates":[-157.950439453125,21.468405577312012]}}]}';

      var expected = JSON.stringify(geojson);
      var url = 'https://raw.githubusercontent.com/patcurry/GeoJsonData/master/singlepoint.json';
      var div = document.createElement('div');

      it('gets the data', function (done) {

        var func = function func(data) {
          data.should.equal(expected);
          done();
        };

        makeReq(url, func, div);
      });
    });
    /*
    it('should parse fetched data as JSON', function(done) {
        var data = { foo: 'bar' };
        var dataJson = JSON.stringify(data);
    
        myapi.get(function(err, result) {
            result.should.deep.equal(data);
            done();
        });
    
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
    });
    */
  });
});