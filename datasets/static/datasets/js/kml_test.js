function showKmlData1() {
  new google.maps.KmlLayer({
    url: 'https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/westcampus.kml',
    map: map
  });
}

function showKmlData2() {
  new google.maps.KmlLayer({
    url: 'https://github.com/zmtdummy/GeoJsonData/raw/master/berlin_craft_beer_locations.kmz',
    map: map
  });
}
