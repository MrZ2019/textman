
var sqlite3 = require('sqlite3');
exports.connect = function(dbname) {

	db = new sqlite3.Database(dbname, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
		function(err) {
			var txt = '';
			if(err) {
				txt = '在连接到数据库 ' + dbname + ' 发生错误\n' +
				err;
			}
			else {
				txt = '连接数据库 ' + dbname + ' 成功';
			}
			// console.log(txt);
		});

	return db;
}