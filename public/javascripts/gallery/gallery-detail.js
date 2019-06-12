
$(function() {



	$('ul').on('click', 'li', function(e) {
		var songlist = $(this).attr('filelist').split(',');

		var index = Math.round(Math.random() * (songlist.length-1));

		var url = "http://192.168.191.1:8080/"
		$('#player').attr('src', url + songlist[index])[0].play();
	})	
})
