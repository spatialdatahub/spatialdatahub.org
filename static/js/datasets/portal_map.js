var myNamespace = (function(w, d, $) {
	// w = window, d = document, $ = jQuery

	// set up the map
	var myMap;
	myMap = new L.Map('mapid')

	// create base tile layer for map
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osm = new L.TileLayer(osmUrl, 
		{
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		minZoom:0, 
		maxZoom: 18
		}
	);

	// set map view and add base layer
	myMap.setView({lat: 0, lng: 8.8460}, 2);
	myMap.addLayer(osm);

})(window, document, jQuery);

console.log(typeof myNamespace);
console.log(typeof myMap);
