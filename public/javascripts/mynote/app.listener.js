/**
 * Created by sha on 8/27/14.
 */

var pageSize = 50;
var formItem;
var domTable;
var templateTable = {};

var hSlide;
var isSlideshow;

var progress;


_flow.startListen = function() {
	
	// var body = $(document);

	// body.ajaxStart(function() {

	// 	var pane = $('#pane-' + window.CUR_TYPE);

	// 	pane.find('.table-wrap').isLoading({
	// 		text: '正在请求数据',
	// 		position: 'overlay'
	// 	})
	// }).ajaxComplete(function() {
	// 	var pane = $('#pane-' + window.CUR_TYPE);
	// 	pane.find('.table-wrap').isLoading('hide');
	// })
	function deleteRow(type, id) {				
		$.ajax(
		{
			"url": "/api/delrow",
			"data": 
			{
				"id": id,
				type: type
			},
			"method": "get",
			cache: false,
			"success": function(res) {
				showSuccess("成功删除数据");

				_flow.render(type);
			},
			"error": function(xhr, err) {
				showError("删除失败");
			}
		});
	}

	// 标签页事件
	$('body').on('show.bs.tab', '#table-tab a', function(e) {
		var a = $(e.target);

		var type = a.attr('href').replace('#pane-','');
		window.CUR_TYPE = type;
		if(!initedType[type]) {
			_flow.render(type);
			initedType[type] = true;
		}
	});
	
	// 筛选
	$('body').on('change', 'select.filter', function(e) {
		_flow.render(window.CUR_TYPE);
	});
	
	$('body').on('click', '#table-tab li a[data-toggle=tab]', function(e) {

		var elm = $(e.target);
		elm.parents('#table-tab').find('.active').removeClass('active');
		elm.parents('.tab-li').addClass('active').siblings().removeClass('active');
	});

	$('body').on('click', '.tab-pane .btn-submit', function(e) {
		var elm = $(e.target);
		var tableName = elm.parents('.tab2').attr('table-name');
		var content = elm.siblings('.content').val();
		var type = elm.siblings('.sel-type').val();
		var tag = elm.siblings('.tag').val();
		var datetime = elm.siblings('.datetime').val() || getDate();
		var item = elm.siblings('.item').val();

		tag += '###' + datetime;
		$.ajax(
		{
			"url": "/api/adddata",
			"data": 
			{
				tableName: tableName,
				content: content,
				type: type,
				tag: tag,
				item: item
			},
			"method": "POST",
			"success": function(res) {				
				showSuccess("成功插入数据");

				_flow.render(tableName, 1, true);
			},
			"error": function(xhr, err) {
				showError("插入失败");
			}
		});

	});
	
	$('body').on('click', '.a-delete', function(e) {
		var elm = $(e.target);

		var type = elm.parents('table').attr('table-name');
		var id = elm.parents('tr').attr('id');

		if(confirm('确认删除吗'))
			deleteRow(type, id);
	});
	
	$('body').on('click', '.btn-refresh', function(e) {
		_flow.render(window.CUR_TYPE);
	});
	
	$('body').on('change', 'input.sql', function(e) {
		_flow.render(window.CUR_TYPE);
	});

	var dlgModify = $('#dlg-edit');

	var inpId = dlgModify.find('#rowid');
	var inpType = dlgModify.find('#inputType')
	var inpContent = dlgModify.find('#inputContent')
	var inpTag = dlgModify.find('#inputTag')	
	var inpItem = dlgModify.find('#inputItem')	

	$('body').on('click', '.a-edit', function(e) {
		var elm = $(e.target);
		var type = elm.parents('table').attr('table-name');
		
		dlgModify.modal('show');
		dlgModify.attr('table-type', type);
		var map = TableMap[type]['typeMap'];

		for(var k in map) {
			var val = map[k];

			var option = $('<option>').text(val).val(k);

			inpType.append(option);
		}	

		var data = JSON.parse($(this).parents('tr').attr('data'))
		inpId.val(data.id);
		inpType.val(data.type)
		inpItem.val(data.item)
		var content = data.content;
		if(typeof content == 'object')
			content = JSON.stringify(content);
		inpContent.val(content)
		inpTag.val(data.tag)
	})	
	
	dlgModify.find('#btn-save-edit').on('click', function(e) {

		var id = inpId.val()
		var type = inpType.val()
		var content = inpContent.val()
		var tag = inpTag.val()
		var item = inpItem.val()

		var rowtype = dlgModify.attr('table-type');
		$.ajax(
		{
			"url": "/api/editrow",
			"data": 
			{
				tableName: rowtype,
				"id": id,
				type: type,
				content: content,
				tag: tag,
				item: item
			},
			"method": "get",
			"success": function(res) {
				showSuccess("成功修改数据");
				

				var page = $('#pane-' + rowtype).find('.pagination .active a').text()
				_flow.render(rowtype, page, false, true);

				dlgModify.modal('hide');

			},
			"error": function(xhr, err) {
				showError("修改失败");
			}
		});		
	})
}
_flow.startListener = function() {



	$('#btn-sync-void').on('click', function() {

		var url = 'http://192.168.191.1/Nature/CodeForest/_LAB/site-lab/void1.space/api/note/sync.php';

		var data = 
		{
			action: 'pc_sync'
		}
		$.ajax({
			url: url,
			method: 'post',
		    contentType:'application/json; charset=UTF-8',
		    data: JSON.stringify(data),// 数据 必须是字符串
		    dataType: 'json',

			success: function(data) {

				// 上传至void

				$.ajax(
				{
					url: '/api/syncvoid',
					method: 'post',
					data: {
						data: data.data
					},
					success:function(data) {
						
						showSuccess('同步成功');

						_flow.render('note');
					},
					error: function() {
						showError('同步失败');
					}
				});
			},

			error: function() {
				showError('连接失败');
			}
		})
	})
}