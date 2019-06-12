
// setScroll($('.zm-item-answer'), function(node) {
// 	node.siblings().css('border', 'none');

// 	node.css('border', 'red 2px solid');

// });
window.scroll = {};
function setScroll(list, onselect, backToTop) {

	var win = $(window);

	win.on('scroll', function(e) {
		
		var top = win.scrollTop();
		var max = top + window.innerHeight;

		if(backToTop) {

			if(top > window.innerHeight) {
				window.backToTop.show();
			}
			else {
				window.backToTop.hide();
			}
		}

		if(!list.length) {
			return;
		}
		for(var i = 0; i < list.length;i++) {

			node = $(list[i]);

			var offset = node.offset();
			var max2 = node.height();

			if(offset.top > top && offset.top < (max - 100)) {
				scroll.showtop = true;
				onselect(node);
				break;
			}
			else if(offset.top < top && (offset.top+max2) > max){
				scroll.showtop = false;
				onselect(node);
				break;
			}
		};
	});
}