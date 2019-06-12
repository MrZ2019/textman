
var mysql = require("mysql");
var host = "localhost";
var connection = mysql.createConnection({
	"host": host,
	"user": "root",
	"pass": "",
	"port": 3306,
	"database": "mynote"
});

connection.connect(function(err) {
	if(err) {
		console.error("mysql connect error \n" + err);
	}
	else {
		console.log("you connected to " + host + "!");
	}
});

exports.index = function(req, res) {

	// 取得表数据

	connection.query("SELECT * FROM mysong", function(err, rows, fields) {
		res.render("mysong",
		{
			"data": rows
		});		
	});
}

exports.addsong = function(req, res) {
	var body = req.body;
	var sql = "INSERT INTO mysong (" + 
		"song_title,persons, other_songs, places,keywords,create_time" +
		") VALUES(" + "'" + body.song_title + "', '" +  body.persons +
		 "','" + body.other_songs + "','" + body.places + "','" + body.keywords +
		 "',NOW())";

	connection.query(sql, function(err, rows) {
		if(err) {
			console.log("insert failed - " + err);
			res.end("error");
		}
		else {
			console.log(sql + " executed");
			res.end("ok");
		}
	})
}

exports.delsong = function(req, res) {

	var songId = req.body.id;

	var sql = "delete from mysong where id=" + songId;

	// 执行sql 删除操作

	connection.query(sql, function(err, result) {
		if(err) {
			console.log(sql + " failed");
			res.end("error");
		}
		else {
			console.log(sql + " executed");
			res.end("ok");
		}
	});
}

exports.editsong = function(req, res) {

	var body = req.body;
	var songId = req.body.id;

	var sql = "UPDATE mysong SET song_title='" 
	+ body.song_title + "', persons='" + body.persons
	+ "', other_songs='" + body.other_songs + "', places='"
	+ body.places + "', keywords='" + body.keywords + "' WHERE id="
	+ body.song_id + ";";

	connection.query(sql, function(err, result) {
		if(err) {
			console.log(sql + " failed");
			res.end("error");
		}
		else {
			console.log(sql + " executed");
			res.end("ok");
		}		
	});
}