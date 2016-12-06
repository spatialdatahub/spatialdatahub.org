var assert = chai.assert;

// Base JavaScript File Tests
describe('The base.js tests', function() {

  describe('The DOM ready function', function() {
    it('does not have not a finished test');
  });

  describe('The toggleDisplay function', function() {

    before(function() {
      toggleDisplay('item_to_hide');
    });

    it(`should set 'display' for item_to_hide to an empty string since 
        the item_to_hide since toggleDisplay has been called once`,
        function() {
          assert.equal(item_to_hide.style.display, "");
        }
    );

    it(`should set 'display' for the item_to_hide to 'none' 
        since toggleDisplay is called twice here`,
        function() {
          toggleDisplay('item_to_hide');
          assert.equal(item_to_hide.style.display, "none");
        }
    );
  });

});

