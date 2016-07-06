// I think that to use the testing functions it maybe easier to wrap everything
// in a larger function called 'portalMap'. I can make it an 'L' function, as
// in 'L.portalMap'.  
var myMap;

var openStreetMapMapnik = L.tileLayer.provider('OpenStreetMap.Mapnik'),
    mapQuestOpenAerial = L.tileLayer.provider('MapQuestOpen.Aerial'),
    openTopoMap = L.tileLayer.provider('OpenTopoMap'),
    stamenWaterColor = L.tileLayer.provider('Stamen.Watercolor'),
    thunderForestSpinalMap = L.tileLayer.provider('Thunderforest.SpinalMap'),
    thunderForestTransportDark = L.tileLayer.provider('Thunderforest.TransportDark'),
    nasaNight = L.tileLayer.provider('NASAGIBS.ViirsEarthAtNight2012');

var baseLayers = {
  "Street Map": openStreetMapMapnik,
  "Aerial": mapQuestOpenAerial,
  "Topo": openTopoMap,
  "Water Color": stamenWaterColor,
  "Spinal Map": thunderForestSpinalMap,
  "Dark Map": thunderForestTransportDark,
  "NASA Night": nasaNight
};


function initMap() {
    // set up the map
    myMap = new L.map('mapid');
  
    // set up default layer for the map, which is the osm mapnik layer
    var osm = L.tileLayer.provider('OpenStreetMap.Mapnik', {
        minZoom: 0,
        maxZoom: 20,
        maxNativeZoom: 18,  
    })

    // set view
    myMap.setView(new L.LatLng(0, 8.8460), 2);

    // add default layer to map
    myMap.addLayer(osm);

    // add base layer controller to map
    L.control.layers(baseLayers).addTo(myMap);
}



////////////////////////////////////////////////////////////////////////////////////// 

// I still may have a bit of trouble with these functions and loading many layers

// password protected
function getJsonFromLocal(data) {
    L.geoJson(data).addTo(myMap);
}

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

