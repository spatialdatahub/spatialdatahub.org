$( document ).ready(function() {
	var value = $('#mapid').attr('value');
	$.ajax({url:"/ajax/load_dataset/" + value,  
		success: function(data){
			L.geoJson($.parseJSON(data)).addTo(myMap);
		}
	});
});
