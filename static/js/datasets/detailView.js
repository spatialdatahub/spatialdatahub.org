// This is the javascript file for the map detail view
// I need a script that loads the map specific to this page
// can I write this without jQuery?

// I need to write some tests for all this stuff


// when document is fully loaded make call to the ajax data request 
// display the map and put pop ups on it and stuff.

/*
$( document ).ready( function () {
  var value = $('#mapid').attr('value');
  $.ajax({url:'/load_dataset/' + value,
    success: function (data) {
      L.geoJson($.parseJSON(data)).addTo(myMap);
    }
  });
});

// ES6ify it
$( document ).ready( (url, value) => {
  baseUrl = '/load_dataset/';
  value = $('#mapid').attr('value');
  $.ajax({url: `${baseUrl}${value}`,
    success: data => {
      L.geoJson($.parseJSON(data)).addTo(myMap);
    }
  });
});

// Use leaflet omnivore
$( document ).ready( (url, value) => {
  baseUrl = '/load_dataset/';
  value = $('#mapid').attr('value');
  let dataset = omnivore.geojson(url=`${baseUrl}${value}`).addTo(myMap);
});
*/


// get rid of jQuery
// more getting rid of jQuery

// define DOM ready function
// I did this in the base_map.js file
/*
const domReady = function(callback) {
  document.readyState === "interactive" ||
  document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady( (baseUrl, value, dataset) => { 
  baseUrl = '/load_dataset/';
  value = document.getElementById('mapid').getAttribute('value');
  dataset = omnivore.geojson(url=`${baseUrl}${value}`);
  dataset.addTo(myMap);
});
*/


// add popups

domReady( (baseUrl, value, dataset) => { 
  baseUrl = '/load_dataset/';
  value = document.getElementById('mapid').getAttribute('value');
  dataset = omnivore.geojson(url=`${baseUrl}${value}`);
  // put on ready add on each feature pop up thing here
  // the pop up thing may be definable in the base_map file
  dataset.addTo(myMap);
});


