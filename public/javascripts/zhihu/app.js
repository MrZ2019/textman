
var folder;
var type = location.href.match('douban') ? 'douban': 'zhihu2';

var prefix = '/resources/' + type + '/img/';
$(function() {

	
	folder = $('folder').attr('folder');

	if(folder) {
		prefix += folder + '/';
	}
	var tag = type == 'douban' ? 'db' : 'zh'
	$(tag + '-img').each(function(i, img) {
		img = $(img);
		var filename = img.text().match(/([^\/]+)\.\w+$/)[1];
		// filename = filename.replace(/[\|]/g, ' ')
		var src = prefix + filename + '.jpg';

		var img2 = $('<img>').attr('src', src);

		img.replaceWith(img2);
	});

	// 
	var List = $('.answer-list li, .comment-list li.answer, .note-content li');

	List.each(function(i, elm) {
		elm = $(elm);

		var img = elm.find('.content img:first');

		if(img.length) {
			img = img.clone();
			img.addClass('thumb');
			elm.find('.content').prepend(img);
		}
	});

	window.backToTop = $('.zh-backtotop');
	backToTop.on('click', function(e) {

		window.scrollTo(null,0);
		backToTop.hide();
	});

	setScroll(List, function(li) {
		li.siblings().removeClass('selected');
		li.addClass('selected');
		if(!li.hasClass('collapse'))
			$('.btn-collapse').show();
		else {
			$('.btn-collapse').hide();
		}
	}, true);
	
	$('.btn-collapse').hide();

	$('.btn-collapse').on('click', function(e) {

		var _elm = $(e.target);

		_elm.hide();
		var li = $('ul > li.selected');

		li.addClass('collapse');

		if(!scroll.showtop) {
			li[0].scrollIntoView();
			window.scrollBy(0, -50);
		}
	});
	
	$('.show-all').on('click', function(e) {

		var li = $(e.target).parents('li');

		li.removeClass('collapse');
	});


});
