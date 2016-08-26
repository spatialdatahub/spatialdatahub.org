(function($, window, document) {
	var value = $('#mapid').attr('value');
	$.ajax({url:"/ajax/load_dataset/" + value,  
		success: function(data){
			getJsonFromLocal($.parseJSON(data));
		}
	});
}(window.jQuery, window, document));
