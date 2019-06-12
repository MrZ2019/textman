
var fs = require('fs');
var iconv = require('iconv-lite');
var dir = 'mynote/public/resources/gallery/';

exports.index = function(req, res) {
	console.log(process.cwd())
	fs.readdir(dir, function(err, files) {
		if(err) {
			console.log(err);
			return;
		}
		var folderList = [];
		files.forEach(function(file) {

			var info = fs.statSync(dir + file);

			if(info.isDirectory()) {
				folderList.push(file);
			}
		})
		
		res.render("gallery", {
			dir: 'resources/gallery/',
			list: folderList
		});		
	})

}

exports.detail = function(req, res) {
	var title = req.params.title;

	var song = fs.readFileSync(dir + title + '/song.txt','binary');
	song = iconv.decode(song, 'gbk');
	song = song.split(/\s+/);

	var musicdir = 'k:/163/';
	var data = [];
	song.forEach(function(item) {
		var obj = {};

		obj.name = item;
		obj.filelist = [];
		obj.exp = new RegExp(item);
		data.push(obj);
	});

	fs.readdir(musicdir, function(err, files) {
		files.forEach(function(f) {
			for(var i = 0; i < data.length; i++) {

				var s = data[i];
				if(f.match(s.exp)) {
					s.filelist.push(f);
					console.log(f);
				}	

			}
		});


		// 读取图片
		var path = dir + title;
		var path2 = '../resources/gallery/' + title + '/';
		search(path, '\.jpg', function(result) {
			for(var i = 0; i < result.length; i++) {
				result[i] = path2 + result[i];
			}
			data.imgs = result;
			res.render('gallery-detail', {
			data: data
			})			
		}) 

	});	
}

function search(path, keyword, callback) {
	console.log(path);
	var result = [];
	fs.readdir(path, function(err, files) {
		if(err)
			console.log(err);
		var exp = new RegExp(keyword);

		files.forEach(function(f) {

			if(f.match(exp)) {
				result.push(f);
			}
		});

		callback(result);
	})
}