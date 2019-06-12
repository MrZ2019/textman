
_flow.setupTable = function() {

	// 生成页面
	var tab1 = $('.tab1');
	var tab1Nav = tab1.find('>.nav');
	var tab1NavLi = $('#hidden .tab-li');
	var tab1SubLi = $('#hidden .sub-li');
	var tab1Content = tab1.find('>.tab-content');
	var tab1ContentPanel = $('#hidden .tab-pane');

	createPaneFromList(TableList);
	function createPaneFromList(TableList) {
		_.each(TableList, function(item, i) {
			var navLi;
			var panel;

			navLi = tab1NavLi.clone();
			navLi.find('.text').text(item.name);
			tab1Nav.append(navLi);

			// panel = tab1ContentPanel.clone();
			// tab1Content.append(panel);



			//setPane(item, navLi, panel);	

			_.each(item.list, function(item2, i2) {

				var navLi2 = tab1SubLi.clone();
				navLi.find('ul').append(navLi2);

				panel = tab1ContentPanel.clone();
				tab1Content.append(panel);	

				setPane(item2, navLi2, panel);			
			});

			function setPane(item, navLi, panel) {
				navLi.find('a').attr('href', '#pane-' + item.tableName)
				.text(item.name);
				
				panel.attr('id', 'pane-' + item.tableName);

				panel.find('>ul li:nth-child(1) a').attr('href', '#edit-' + item.tableName);
				panel.find('>ul li:nth-child(2) a').attr('href', '#view-' + item.tableName);
				panel.find('>.tab-content .tab-pane:nth-child(1)').attr('id', 'edit-' + item.tableName);
				panel.find('>.tab-content .tab-pane:nth-child(2)').attr('id', 'view-' + item.tableName);

				panel.attr('table-name', item.tableName);
				panel.find('table').attr('table-name', item.tableName);
				// 初始化select选项	
				panel.find('.sel-type').empty();
				_.each(item.typeMap, function(typeValue, typeName) {
					var option = $('<option value=' + typeName + '>' + typeValue + '</option>');
					panel.find('.sel-type').append(option)	
					panel.find('.filter').append(option)	
				})
				
				var option = $('<option value="' + '' + '">' + '所有' + '</option>'); 
				panel.find('.filter').prepend(option).val('');
				panel.find('.sql').attr('sqltype', item.tableName);

			}			
		});
	}
	$.ajax({
		url: 'ejs/common-table.ejs',
		success: function(html) {
			templateTable['common'] = html;
			
			//_flow.renderAll(true); 
		}
	}); 
	_flow.startListen();
    _flow.setupPaginator();
    _flow.setupSlideShow();

    // 显示指定界面
    $('[href="#pane-' + settings.initType + '"]').trigger('click');
    if (settings.initPage == 'view') {
        $('.tab-pane .nav li:nth-child(2) a').trigger('click');
    } else {
        $('.tab-pane .nav li:first-child a').trigger('click');
    }	

   
}