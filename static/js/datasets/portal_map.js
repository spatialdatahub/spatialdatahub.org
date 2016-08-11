// I think that to use the testing functions it maybe easier to wrap everything
// in a larger function called 'portalMap'. I can make it an 'L' function, as
// in 'L.portalMap'.  


var myMap = L.map('mapid').setView([0, 8.8460], 2);
var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

// This is the default layer for the map. I don't really like the way it looks with the
// ZMT colors. It clashes. So this will probably change. Other maps will be provided
// for users to choose.

L.tileLayer.provider('OpenStreetMap.Mapnik', {
  minZoom: 0,
  maxZoom: 20,
  maxNativeZoom: 18,  
  attribution: osmAttrib
}).addTo(myMap);

////////////////////////////////////////////////////////////////////////////////////// 
// Allow different background maps to be selected by saving them as variables, and
// creating a selector function.
////////////////////////////////////////////////////////////////////////////////////// 

var openStreetMapMapnik = L.tileLayer.provider('OpenStreetMap.Mapnik'),
    openTopoMap = L.tileLayer.provider('OpenTopoMap'),
    stamenWaterColor = L.tileLayer.provider('Stamen.Watercolor'),
    thunderForestSpinalMap = L.tileLayer.provider('Thunderforest.SpinalMap'),
    thunderForestTransportDark = L.tileLayer.provider('Thunderforest.TransportDark'),
    nasaNight = L.tileLayer.provider('NASAGIBS.ViirsEarthAtNight2012');

var baseLayers = {
  "Street Map": openStreetMapMapnik,
  "Topo": openTopoMap,
  "Water Color": stamenWaterColor,
  "Spinal Map": thunderForestSpinalMap,
  "Dark Map": thunderForestTransportDark,
  "NASA Night": nasaNight
};

L.control.layers(baseLayers).addTo(myMap);

////////////////////////////////////////////////////////////////////////////////////// 

// I still may have a bit of trouble with these functions and loading many layers

function getJsonFromLocal(data) {
    console.log(data);
//    L.geoJson(data).addTo(myMap);
}

//L.geoJson(data).addTo(myMap);
//L.geoJson(test).addTo(myMap);

// not password protected
function getJsonFromUrl(data) {
    omnivore.geojson(data).addTo(myMap);
}

// not password protected
function getKMLFromUrl(data) {
    omnivore.kml(data).addTo(myMap);
}

////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////// 


var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJson(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(myMap);




////////////////////////////////////////////////////////////////////////////////////// 
////////////////////////////////////////////////////////////////////////////////////// 




var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent(e.latlng.toString())
    .openOn(myMap);
}

myMap.on('click', onMapClick);

// This takes it too far and actually removes the map background as well.
function clearAllLayers() {
  myMap.eachLayer(function (layer) {
    myMap.removeLayer(layer);
  });
}

