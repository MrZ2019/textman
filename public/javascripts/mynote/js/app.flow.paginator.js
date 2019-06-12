_flow.setupPaginator = function() {

    $('.tab-pane .tab-pane:last-child .form-inline').append('<div class="page">');

    var options = {
        currentPage: 1,
        totalPages: 5,
        numberOfPages: '10',
        size: 'normal',
        alignment: 'center',
        onPageChanged: function(e, oldPage, newPage) {
            var type = $(e.target).parents('.tab-pane:first').attr('id').replace('view-', '');
            _flow.render(type, newPage, false);
        }
    }

    $('.datetime').datetimepicker({
        minView: 'hour'
    });

    $('.page').bootstrapPaginator(options);

    var pageAddon = $('#hidden .page-addon');
    $('.tab-pane .tab-pane:last-child .form-inline').append(pageAddon);

    $('.tab-pane .page-addon .inp-pagesize').val(settings.pageSize);
    
    $('body').on('change', '.page-addon .inp-pagesize', function(e) {

        var type = $(e.target).parents('.tab-pane:first').attr('id').replace('view-', '');
        var page = 1 || 　$(e.target).parents('.tab-pane:first').find('.pagination .active a').text()

        _flow.render(type, page, true);
    });

    $('body').on('change', '.page-addon .inp-pagenum', function(e) {

        var pagenum = $(e.target).val();

         var page = $(e.target).parents('.tab-pane:first').find('.pagination')
         page.bootstrapPaginator('show',pagenum);

    });     

}
