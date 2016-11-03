// This file has base JS stuff, such as the document.ready command
// and a toggle display command.

// define DOM ready function
const domReady = function(callback) {
  document.readyState === "interactive" ||
  document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};


// define toggle element display function
function toggleDisplay(obj) {
  let element = document.getElementById(obj);
  if ( element.style.display != 'none' ) {
    element.style.display = 'none';
  } else {
    element.style.display = '';
  }
};
