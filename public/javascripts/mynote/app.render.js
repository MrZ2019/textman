/**
 * Created by sha on 9/28/14.
 */


_flow.renderAll = function(isRefresh) {

	_.each(TableList, function(item) {
		_.each(item.list, function(item) {
			_flow.render(item.tableName, 1, isRefresh);		
		})
		
	})
}

_flow.render = function(type, page,  isRefresh, isEdit) {
	if(typeof(isRefresh) == 'undefined') {
		isRefresh = true;
	}
	loadData(type, page, isRefresh, isEdit);
}

_flow.refresh = function() {
	_flow.renderAll(true);
}

function loadData(type, page, isRefresh, isEdit) {

	var sql = $('.sql[sqltype=' + type + ']').val() || '';
	var filter = $('#pane-' + type + ' .filter').val() || '';
	var pageSize = $('#view-' + type).find('.inp-pagesize').val();
	if(sql=='') {
		sql += '? ';
		if(filter) {
			sql += 'WHERE type=' + filter + ' ';
		}
		if(order == 'desc') {
			sql += 'order by id desc';
		}
		else if(order == 'shuffle') {
			sql += 'ORDER BY RANDOM()';
		}
	}

	var pane = $('#pane-' + type);

	pane.find('.table-wrap').isLoading({
		text: '正在请求数据',
		position: 'overlay'
	})	
	$.ajax({
		url: 'api/getdata',
		data: {
			type: type,
			sql: sql,
			pageSize: pageSize,
			pageNum: page || 1
		},
		cache: false,
		method: 'get',
		success: function(res) {
			res = JSON.parse(res);

			// if(order == 'shuffle')
			// 	arrayShuffle(res.data);
			pane.find('.table-wrap').isLoading('hide');
			DATA[type] = res;
			
			var templateType = (TableMap[type].template || 'common');
			var html = ejs.render(templateTable[templateType], {
				rows: translateData(res.data, type),
				data: TableMap[type],
				type: type,
				mainType: getMainType(type)
			});

			var table = $('table[table-name=' + type + ']');
			table.html(html);

			if(!isEdit) {
				table.parent()[0].scrollTop = 0;
			}

			// 配置分页
			var paginator = $('#pane-' + type).find('.pagination');
			var options = {
            currentPage: 1,
            totalPages: Math.ceil(res.total / pageSize) || 1
        	}
        	paginator.next().find('.total .i1').text(options.totalPages);
        	paginator.next().find('.total .i2').text(res.total);
        	if(paginator.attr('refresh') || isRefresh){
        		paginator.bootstrapPaginator(options);	
        		paginator.attr('refresh',null);
        	}	

		},
		error: function(xhr, err) {
			showError('加载失败')
		}
	});
}

function translateData(data, type) {
	var mainType = getMainType(type);
	if(TranslateMap[type]) {
		return TranslateMap[type](data);
	}
	else if(TranslateMap[mainType]) {
		return TranslateMap[mainType](data);
	}
	return data;
}

function getMainType(type) {

	for(var k in UnionMap) {

		var list = UnionMap[k];

		if(list.indexOf(type) != -1) {
			return k;
		}
	}
}