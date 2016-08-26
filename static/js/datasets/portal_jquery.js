(function($, window, document) {
	$('.dataset-button').on('click', function() {
		var value = $(this).attr('value');
		$.ajax({url:"/ajax/load_dataset/" + value, 
			success: function(data){
				getJsonFromLocal($.parseJSON(data));
			}
		});
	});
}(window.jQuery, window, document));
