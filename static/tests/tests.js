//1
QUnit.test( "hello test", function( assert ) {
	assert.ok( 1 == "1", "Passed!" );
});

//2
QUnit.test( "smoke test", function( assert ) {
	assert.equal( 1, 1, "Math works!" );
});

function isEven(val) {
	return val % 2 === 0;
}

//3
QUnit.test("isEven()", function( assert ){
	assert.ok(isEven(0), 'Zero is an even number');
	assert.ok(!isEven(1), 'one is not an even number');
	assert.ok(isEven(2), 'two is an even number');
	assert.ok(isEven(-2), 'negative two is an even number');
});


function ajaxLoadDataset( data ) {
	var value = $('#mapid').attr('value');
	data = {
	  "type": "FeatureCollection",
	  "features": [
	    {
	      "type": "Feature",
	      "properties": {},
	      "geometry": {
		"type": "LineString",
		"coordinates": [
		  [
		    8.795153796672821,
		    53.08064530945763
		  ],
		  [
		    -157.78833478689194,
		    21.291583606652843
		  ]
		]
	      }
	    }
	  ]
	}; 
	$.ajax({
		url:"/ajax/load_dataset/" + value,  
		success: console.log(data)
	});
};

//4
QUnit.test("ajax load dataset", function( assert ) {
	// asynchronous so it has to start with a pause
	var done = assert.async();
	assert.expect(1);
	ajaxLoadDataset(function(){
		assert.ok(true);
		done();
	});
});

