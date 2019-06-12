// 加载库
var iconv = require('iconv-lite');

// 加载配置文件
global.CONFIGMynote = require('../config/mynote').config;

// 初始化数据库
var DB = require('../utils/mynote/db');
DB.initDB();
//DB.addMD5('note2')
var tableMap = {
    'note': 'note2',
}

exports.index = function(req, res) {
    res.render("mynote", {
        rows: []
    });
}
global.onResponse = onResponse;
exports.zhihu = require('./zhihu');
exports.douban = require('./douban/group1');


function onResponse(err, res, msg, data, data2, result) {
        var _res;
        if (err) {
            msg = new Date().toLocaleString() +'  后台操作发生错误:\n' + err;
            if(err.code == 'SQLITE_CONSTRAINT') {
                msg += '\n ID 重复\n'
            }
            console.log(msg.red);
            err.msg = err.toString();
            _res = {
                data: [],
                total: 0,
                error: err,
                code: 50000,
                status: 'error',
                result: result
            }
        }
        else {
            _res = {
                data: data,
                code: 20000,
                status: 'success',
                msg: msg,
                result: result
            }

            if(data2) {
                 _res.total = data2[0].max;            
            }
            msg = new Date().toLocaleString() + msg;
            console.log(msg.green);
        }
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        res.end(JSON.stringify(_res));    
}

exports.getData = function(req, res) {
    //req.query.type = 'note';

    DB.getDataByType(req, res, function(err, data, data2) {
        var msg = '查询成功 table=' + req.query.type;

        onResponse(err,res,msg,data,data2);
    });
}
exports.getAppData = function(req, res) {
    //req.query.type = 'note';

    var msg = '查询成功 table=' + req.query.type;
    delete require.cache[require.resolve('../config/MyNoteAppDATA.json')];
    var data =  require('../config/MyNoteAppDATA.json')

    onResponse(null,res,msg,data,null);
}

//exports.getData({query:{}})
//
exports.addData = function(req, res) {

    DB.addData(req, res, function(err, data) {

        var msg = '添加成功 table=' + req.body.tableName + '  item=' + (req.body.item || '');

        onResponse(err,res,msg,data,null);
    });

}

// exports.addData({
// 	body:{
// 		tableName: 'tutorial',
// 		item: 'item2',
// 		content: '123'
// 	}
// });


exports.deleteRow = function(req, res) {

    DB.deleteData(req, res, function(err) {
        var msg = '删除成功 table=' + req.query.type + '  id=' + (req.query.id || '');

        onResponse(err,res,msg,null,null);
    });
}

//exports.deleteRow({query:{id:1, type: 'tutorial'}})
//

exports.editRow = function(req, res) {
    DB.editData(req, res, function(err) {

        var msg = "修改 " + req.query.tableName + " 成功. id=" + req.query.id;

        onResponse(err,res,msg,null,null);
    })
}

//exports.editRow({query:{id:2, tableName: 'tutorial', content: '777'}})
//
exports.syncVoid = function(req, res) {

    var data = req.body.data;
    var db = dbs['mynote'];

    var sql = "INSERT INTO note2 (content, dateposted, type, tag) VALUES(?,  ?, ?, ?)";
    var stmt = db.prepare(sql);
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        console.log(row.content);

        //db.run(sql, [row.content, row.datepost, 5, ''], function(err) {
        //}); 

        var item = [row.content, row.datepost, 5, ''];
        stmt.run(item);
    }
    stmt.finalize()
    console.log("共 " + data.length + " 条记录, 同步 void 成功.");
    res.writeHead(200);
    res.end('ok');
}
