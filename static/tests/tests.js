QUnit.test( "hello test", function( assert ) {
	assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "smoke test", function( assert ) {
	assert.equal( 1, 1, "Math works!" );
});

function isEven(val) {
	return val % 2 === 0;
}

QUnit.test("isEven()", function( assert ){
	assert.ok(isEven(0), 'Zero is an even number');
	assert.ok(!isEven(1), 'one is not an even number');
	assert.ok(isEven(2), 'two is an even number');
	assert.ok(isEven(-2), 'negative two is an even number');
});

function ajaxLoadDataset() {
	var value = $('#mapid').attr('value');
	$.ajax({url:"/ajax/load_dataset/" + value,  
		success: function(data){
			getJsonFromLocal($.parseJSON(data));
		}
	});
};

Qunit.test("ajax load dataset", function( assert ) {
	// asynchronous so it has to start with a pause
	stop();
	ajax(

	assert.ok(
});
