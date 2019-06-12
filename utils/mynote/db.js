var sqlite3 = require('../../utils/sqlite3');

// 初始化MD5
var md5 = require('md5-js');
var _md5 = function() {

    return md5.apply(this, arguments).substring(8, 24);
}

// 连接数据库
var CONFIG = global.CONFIGMynote;

//console.dir(CONFIG)
var OBJDatabase = CONFIG.OBJDatabase;

global.OBJDatabase = OBJDatabase;

var DBList = OBJDatabase.list;

var OBJTable = CONFIG.OBJTable;
var TABLEList = OBJTable.list;
var TableMap;
// 连接数据库
var dbs = {};
global.dbs = dbs;
connectToDB(dbs, DBList);

setTimeout(function() {
    var d = dbs['jianshu'];

    // d.exec('ATTACH DATABASE "mynote.db"', function(err) {
    //     console.log(err);
    // });
},3000);
function connectToDB(dbs, DBList) {
    var publicDir = OBJDatabase.dir;
    for (var i = 0; i < DBList.length; i++) {

        var cur = DBList[i];
        var file = cur.filename + '.db';
        if(cur.dir) {
            file = './' + publicDir + '/' + cur.dir + '/' + file;
        } else {
            file = './' + publicDir + '/' + file;
        }

        // console.log(file)
        dbs[cur.filename] = sqlite3.connect(file);
    }
}


exports.initDB = function() {
    exports.createTables(TABLEList, OBJTable);
}

exports.listDouban = function() {
    var db = dbs['douban_book1'];
        db.all('select * from douban_book1', 
        function(err, rows) {
            if(err) 
                console.log(err);

            for(var i = 0; i < rows.length; i++) {

                var row = rows[i];
                var obj =  JSON.parse(row.content)
                var subject_id =obj.id;

                (function(row, subject_id) {
                    db.run('UPDATE douban_book1 set subject_id=' + subject_id + 
                        ' WHERE id=' + row.id, function(err) {

                            if(err) 
                                console.log(err.toString().red);      
                            else {
                                var str = 'id=' + row.id + ' subject_id=' + subject_id +
                                    ' item=' + row.item;
                                console.log(str.green); 
                            }                  
                        })
                })(row, subject_id);

            }
        })
}

//exports.listDouban();
exports.startMD5 = function(list) {

    if(!list.length) {
        return;
    }
    var table = list.shift();
    console.log(table.name.blue);

    exports.addMD5(table.name, function() {

        exports.startMD5(list);
    });
}
exports.addMD5 = function(tableName, success) {
    //console.log(success)
    var START_POS = 8000;
    var sql1 = 'ALTER TABLE ' + tableName + ' ADD COLUMN md5 varchar(16)';
    var db = exports.getDBByTable(tableName);
    var success2 = success;
    db.run(sql1, function(err,data) {
        if(err) {
            console.log(err);
        }
        else {
            console.log('添加 md5 字段成功');
        }

        var sql2 = 'SELECT * FROM ' + tableName + ' WHERE md5 is null' ;
        exports.querySQL(sql2, tableName, function(err, data) {
            var i = 0;
            setMD5(data);

            function setMD5(rows) {

                var row = data[i];

                if(row) {
                    var valMD5 = _md5(row.content)
                    var sql3 = 'UPDATE ' + tableName + ' SET md5="' + valMD5 + '" WHERE id=' + row.id;
                    db.run(sql3, function(err, data) {

                        if(err) {
                            console.log(err);
                            return;
                        }
                        var str = '\ntable:' +  tableName + '     id=' + row.id + ' md5=' +valMD5 + '\n'
                        console.log(str.green);
                        i++;
                        setMD5(rows);

                    })
                }
                else {
                    success();
                }
            }

        });         
    });
}

exports.getDBByTable = function(tableName) {
    var _db = TableMap[tableName].db || 'mynote';
    _db = dbs[_db];

    return _db;
}
exports.createTables = function(tableList, options) {
    var count = 0;
    function _create(cur) {

        if(cur.type) {
            cur.sql = options[cur.type + 'SQL'];
        }
        var sql = 'CREATE TABLE IF NOT EXISTS ' + cur.name +
         (cur.sql || options.commonSQL);
         if (!cur.db) {
            return;
         }
        var _db = dbs[cur.db];
    // _db.run('alter TABLE ' + cur.name + ' add column item varchar(100)', 
    //  function(err) {
    //      if(err) 
    //          console.log(err);
    //      else
    //          console.log('item added');
    //  })        
        _db.run(sql, function(err) {
            var txt;
            if (err) {
                txt = '在创建表 ' + cur.name + ' 的过程中出现错误\n' +
                    err;
            } else {
                txt = '创建表 ' + cur.name + ' 成功+++';
            }
            
            // console.log(txt);

            if(++count >= tableList.length) {
                var list = [].concat(tableList);
                //exports.startMD5(list);
            }
        })
    }
    var map = {};
    // 循环创建 表
    for (var i = 0; i < tableList.length; i++) {
        var cur = tableList[i];

        map[cur.name] = cur;

        _create(cur);
    }

    OBJTable.map = map;
	TableMap = OBJTable.map; 

    global.TableMap = TableMap;   
}

// 查询数据
exports.getDataByType = function(req, res, callback) {

        var type = req.query.type;
        var start = req.query.start;
        var tableName = OBJTable.tableAlias[type] || type;
        var sql = req.query.sql || '';
        var pageSize = req.query.pageSize || 10;
        var pageNum = req.query.pageNum || 　1;
        var strLimit = ' limit ' + (pageSize * (pageNum - 1)) + ',' + pageSize;

        console.log('type=' + type);
        console.log('tableName=' + tableName);

        var query;
        var con = '';
        if(!sql) {
            query = query = 'SELECT * FROM ' + tableName;

            if(start) {
                query += (' WHERE id > ' + start);
            }
        }
        else if (sql[0] == '@') {
            query = sql.slice(1)
        } else if (sql[0] == '?') {
            query = 'SELECT * FROM ' + tableName + ' ' + sql.slice(1);
            query += strLimit;
        } else if (sql[0] == '#') {
            query = 'SELECT * FROM  ' + tableName + ' where (item like "%' + sql.slice(1) + '%")';
            query += strLimit;
        }
        else {
            query = 'SELECT * FROM  ' + tableName + ' where (content like "%' + sql + '%" or tag like "%' + sql + '%" or item like "%' + sql + '%")';           
            query += strLimit;

        }
        con = query
        .replace(new RegExp('.+' + tableName), '')
        .replace(/order by .+$/, ' ')
        .replace(/limit.+$/, ' ');
        console.log('query=' + query)

        //console.dir(TableMap);
        var _db = TableMap[tableName].db || 'mynote';
        _db = dbs[_db];
        exports.querySQL(query, tableName, function(err, data) {

            var query2 = 'select count(id) as max from  ' + tableName + con;

            console.log('query2=' +query2);           
            _db.all(query2, function(err2, data2) {

                callback(err || err2, data, data2);
            })            
        })
        
}

exports.querySQL = function(sql, tableName, callback) {
        var _db = TableMap[tableName].db || 'mynote';
        _db = dbs[_db];    
        _db.all(sql, function(err, data) {

            callback(err, data);
        });
}
// 添加数据
exports.addData = function(req, res, callback) {

	var body = req.body;
	var strContent = body.content;
	var tableName = body.tableName;
	var type = body.type;
    tableName = OBJTable.tableAlias[tableName] || tableName;

	//strContent = iconv.decode(strContent, 'gbk').toString();
    var _db = TableMap[tableName].db || 'mynote';
    _db = dbs[_db]; 


    if(body.update == 1) {
        sql = 'UPDATE ' + tableName + ' SET content=? WHERE subject_id=?';

        _db.run(sql, [strContent, body.subject_id ], function(err, data) {
            console.log(('update ok ' + body.item).green);
            callback(err, data);
        });  
        return;      
    }
	var sql = "INSERT INTO " + tableName + " (content, type, dateposted, tag, item) VALUES(?, ?, ?, ?, ?)";
	

    if(body.subject_id) {

        sql = "INSERT INTO " + tableName + 
        " (content, type, dateposted, tag, item, subject_id, code) VALUES(?, ?, ?, ?, ?,?,?)";

    }

    console.log('insert=' + sql)

	_db.run(sql, [strContent, type, new Date(), body.tag || '', body.item || '', 
        body.subject_id, body.code ], function(err, data) {

		callback(err, data);
	}); 
}

// 删除数据
exports.deleteData = function(req, res, callback) {
	var query = req.query;
	var id = query.id;
	var type = query.type;

	var tableName = OBJTable.tableAlias[type] || type;

	var sql = "DELETE FROM " + tableName + ' WHERE id=' + id;

    var _db = TableMap[tableName].db || 'mynote';
    _db = dbs[_db];		
	_db.run(sql, [], function(err) {

		callback(err);
	}); 

}

// 编辑数据
exports.editData = function(req, res, callback) {
	var query = req.query;
	var tableName = query.tableName;
	var id = query.id;
	var type = query.type;
	var item = query.item;
	var tag = query.tag;
	var content = query.content;

	tableName = OBJTable.tableAlias[tableName] || tableName;
	
	var sql = "update " + tableName + " set type=" + type 
	+",item='" + item + "',content='" + content + "',tag='" + tag + "' WHERE id=" + id;

	console.log('update=' + sql)
    
    var _db = TableMap[tableName].db || 'mynote';
    _db = dbs[_db];	
	_db.run(sql, [], function(err) {
		callback(err);
	}); 
}



    // db.run('CREATE TABLE IF NOT EXISTS note (content TEXT,dateposted DATETIME)', 
    // 	function(err) {
    // 		if(err) 
    // 			console.log(err);
    // 		else
    // 			console.log('table create success');
    // 	})
    //db.run('SET NAMES gbk')
    //
    // db.run('alter TABLE joke add column tag varchar(32)', 
    // 	function(err) {
    // 		if(err) 
    // 			console.log(err);
    // 		else
    // 			console.log('tag added');
    // 	})
