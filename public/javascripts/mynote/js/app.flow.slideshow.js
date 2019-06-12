
_flow.setupSlideShow = function() {

	// 幻灯片相关

    // 初始界面
    $('#dlg-setting #sel-preview').val(settings.modePreview);
    $('#dlg-setting #sel-preview').on('change', function(e) {

        var elm = $(e.target);
        settings.modePreview = elm.val();

        saveSettings();
    });


	var aSlide = $('#a-slideshow');
	var exitShow = $('#exit-show');
	var divSlide = $('.slideshow');
	var slideStatus = divSlide.find('.slide-status');
	var slideText = divSlide.find('.content');

	aSlide.on('click', function(e) {

		if(settings.modePreview == 'mode2') {
			$('body').toggleClass('preview');

			var has = $('body').hasClass('preview');
			if(has) {
				aSlide.find('.str').text('还原');
			}
			else {
				aSlide.find('.str').text('预览');
			}
		}
		else if(settings.modePreview == 'mode1'){
			divSlide.show();
			mainTab.hide();

			startSlideshow();
		}
	})

	exitShow.on('click', function(e) {

		divSlide.hide();
		mainTab.show();

		stopSlideshow();
	})
	if(isSlideshow) {
		divSlide.show();
		mainTab.hide();

		setTimeout(function() {
			startSlideshow();		
		},1000);
	}
	addEventListener('keydown', function(e) {
		var code = e.keyCode;

		if(code == 32) {

			if(hSlide) 
				stopSlideshow();
			else {
				startSlideshow(true);
			}

			if(!$(e.target).is(":input"))
			e.preventDefault();
		}
	})
	function startSlideshow(flag) {
		if(!flag)
		setSlideText();
		hSlide = setInterval(setSlideText, slideInterval);
		slideStatus.text('');
		divSlide.removeClass('pause');
	}

	function stopSlideshow() {

		clearInterval(hSlide);
		hSlide = null;
		slideStatus.text('已暂停');
		divSlide.addClass('pause');
	}

	function setSlideText() {
		slideText.hide();
		var typeIndex = random(typelist.length - 1);
		var type = typelist[typeIndex];
		
		var rows = DATA[type].rows;

		var rowIndex = random(rows.length - 1);

		slideText.text(rows[rowIndex].content);
		slideText.fadeIn();
	}	
}