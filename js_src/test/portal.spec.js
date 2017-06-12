const assert = chai.assert



describe("A test suite", function() {
/*
  beforeEach(function() {
    fixture.base = 'static/js/fixtures'
    fixture.load('portal.fixture.html');
  });
*/

  beforeEach(function() {
    var fixture = '<div id="fixture"><div id="mapid"></div></div>'
    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  it('should fail', function () {
    assert.notEqual(true, false);
  });

});

describe("Number 2", () => {
  it('should pass', () => {
    assert.equal(2,2);
  });
});

describe('The first real test', function () {

});
