$(document).ready(function() {
	console.log('page ready');
	$('#join').click(function(e) {
		console.log('hi');

		//window.location.replace(`http://${window.location.href}/room/${$('#room_id').val()}`);
		window.location.href = `http://google.com`;
	});
});
