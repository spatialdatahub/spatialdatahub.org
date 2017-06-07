const assert = chai.assert

describe("A test suite", function() {
  beforeEach(function() {  });
  afterEach(function() {  });
  it('should fail', function () {
    assert.notEqual(true, false);
  });
});

describe("Number 2", () => {
  it('should pass', () => {
    assert.equal(2,2)
  })
})

describe('The first real test', function () {

})
