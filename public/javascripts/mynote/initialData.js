/**
 * @author shadow
 * @filename
 */

var AppData = new Object();
var AppVar = new Object();
/**
 * load my data!
 * @param path
 */
_flow.initData = function() {

	window.TableList = DataCONFIG.list;
	window.TableMap = {};

	_.each(TableList, function(item) {
		_.each(item.list, function(item2) {
			TableMap[item2.tableName] = item2;	
		})
		
	})

	window.DATA = {};

	window.initedType = {};


	window.UnionMap = {
		'douban': ['douban_book1', 'douban_movie1', 'douban_music1']
	}

	window.EJSMap = {
		'js':  function(type, mainType) {
			if(EJSMap[type] && EJSMap[type]['content']) {
				return EJSMap[type]['content'];
			}
			else if(EJSMap[mainType] && EJSMap[mainType]['content']) {
				return EJSMap[mainType]['content'];
			}
			return "row.content.replace(/<[^>]*>/g,'').replace(/&lt;/g, '<').replace(/&gt;/g, '>')"
		},
		'douban': {
			'content': '"<img src=" + row.content.img + ">" + row.content.summary'
			//'content': ' row.content.author_intro'
		}
	}

	window.TranslateMap = {

		'douban': function(data) {

			for(var i = 0; i < data.length; i++) {
				var row = data[i];
				row.content = JSON.parse(row.content);
			}
			return data
		}
	}
}
