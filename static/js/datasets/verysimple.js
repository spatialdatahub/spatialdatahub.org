var myMap = L.map('mapid').setView([0, 8.8460], 2);

// This is the default layer for the map. I don't really like the way it looks with the
// ZMT colors. It clashes. So this will probably change. Other maps will be provided
// for users to choose.


L.tileLayer('http://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png',
{
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
}).addTo(myMap);
