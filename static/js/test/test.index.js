// I'm not going to fool around with trying to run mocha from the command line
// right now, it's more important that I have tests, than tests that can be
// run from the command line.

var jsdom = require("jsdom");

jsdom.env(
  '<p><a id="the-link" href="https://github.com/tmpvar/jsdom">jsdom!</a></p>',
  function (err, window) {
    console.log(
      "contents of a.the-link:",
       window.getElementById("the-link").text());
  }
);

/*
describe('Index.js tests', function() {
  describe('classToggle function', function() {
    const classToggleEl = document.getElementById('class_toggle_el')
    it('should take and element and class name to switch on and off', function() {
      classToggle(classToggleEl, 'yes')
      assert.equal(classToggleEl.getAttribute('class'), 'yes')
    })
  })
})
*/
