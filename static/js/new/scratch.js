'use strict';

function getSelectedPlacePolygon(sp) {
  // first make sure that sp has something
  if (sp[0]) {
    // maybe this should just be a function that returns the polygon if it's there
    var selectedPlaceType = sp[0].toGeoJSON().features[0].geometry.type;
    if (selectedPlaceType === 'Polygon' || selectedPlaceType === 'MultiPolygon') {
      var p = sp[0];
      return p.toGeoJSON();
    } else {
      return 'not a polygon';
    }
  } else {
    return 'not a polygon';
  }
}

function getSelectedPlacePolygon(sp) {
  if (sp[0]) {
    var p = sp[0].toGeoJSON();
    var spt = p.features[0].geometry.type; // spt = selected place type

    if (spt === 'Polygon' || spt === 'MultiPolygon') {
      return p;
    } else {
      return 'not a polygon';
    }
  } else {
    return 'not a polygon';
  }
}