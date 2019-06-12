_flow.setupSettings = function() {

    // 初化化设置
    window.settings = (localStorage['$mynote'] && JSON.parse(localStorage['$mynote'])) || {
        initType: 'sentence',
        initPage: 'view',
        pageSize: CONFIG.pageSize,
        modePreview: 'mode2'
    };
    if (!localStorage['$mynote'])
        saveSettings('初化化设置.....');


    // 初始化视图模式
    var hash = location.hash;
    if (hash == '#slideshow') {
        isSlideshow = true;
    } else if (hash == '#slideshow-small') {
        isSlideshow = true;
        $('body').addClass('small');
    }

    var mainTab = $('#main-tab');

    // settings

    // 时间列 开关
    var radioShowtime = $('#radio-showtime');
    radioShowtime.on('change', function() {

        var checked = $(this).prop('checked');

        if (checked)
            $('body').addClass('showtime');
        else
            $('body').removeClass('showtime');

        localStorage['showtime'] = checked;
    });
    var showtime = localStorage['showtime'] || 'true';
    if (showtime == 'true') {
        radioShowtime.prop('checked', true);
    } else {
        radioShowtime.prop('checked', false);
    }
    radioShowtime.trigger('change');

    // 列表顺序
    var radioOrder = $("[name=radio-order]");
    radioOrder.on('change', function() {

        window.order = radioOrder.filter(':checked').val();
        localStorage['order'] = order;

        _flow.render(window.CUR_TYPE);
    })
    window.order = localStorage['order'] || 'asc';
    radioOrder.filter('[value=' + order + ']').prop('checked', true);

    // 初始类型
    for (var i = 0; i < TableList.length; i++) {
        var collection = TableList[i];

        _.each(collection.list, function(item) {
            var opt = '<option value="' + item.tableName + '">' + item.name + '</option>';
            $('#dlg-setting #sel-type').append(opt);
           
        })
    }
    $('#dlg-setting #sel-type').val(settings.initType);
    $('#dlg-setting #sel-type').on('change', function(e) {

        var elm = $(e.target);
        settings.initType = elm.val();

        saveSettings();
    });

    // 初始界面
    $('#dlg-setting #sel-page').val(settings.initPage);
    $('#dlg-setting #sel-page').on('change', function(e) {

        var elm = $(e.target);
        settings.initPage = elm.val();

        saveSettings();
    });

    // 初始页面大小
    $('#dlg-setting #inp-pagesize').val(settings.pageSize);
    $('#dlg-setting #inp-pagesize').on('change', function(e) {

        var elm = $(e.target);
        settings.pageSize = elm.val();
        saveSettings();
    });



    // 幻灯片设置	
    var rangeSlide = $('#range-slide');
    var slideVal = rangeSlide.siblings('.time').find('.value');

    var slideInterval = parseInt(localStorage['slideInterval']) || CONFIG.slideInterval;
    slideVal.text(slideInterval);
    rangeSlide.val(slideInterval)

    rangeSlide.on('change', function(e) {
        var val = e.target.value;
        slideVal.text(val);

        localStorage['slideInterval'] = val;
        slideInterval = val;
    })
}
