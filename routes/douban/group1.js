var sqlite3 = require('../../utils/sqlite3');
var util = global.util;
var dbs = global.dbs;
var onResponse = global.onResponse;
var DBNAME = 'group1';
var _db = dbs[DBNAME];

// connect to database

var dbObj = global.OBJDatabase;
var dbZhihu = dbObj.zhihu;
var dbTopics = {};
for(var i = 0; i < dbZhihu.length;i++) {
	var name = 'zhihu' + dbZhihu[i].db 
	var file = './' + dbObj.dir + '/zhihu/' + name + '.db'; 
	dbs[name] = sqlite3.connect(file);

	var topics = dbZhihu[i].topics;

	for(var j = 0; j < topics.length;j++) {
		var topic = topics[j];
		var topicId = topic.id;
		dbTopics[topicId] = dbs[name];
	}
}


var USER_SEP = '#@#';
var picFolder = 'M:\\Nature\\CodeForest\\_LAB\\project-lab\\mynote\\public\\resources\\douban\\user\\'
exports.index = function(req, res) {
	var limit = req.query.limit || 0;
	var sql = 'select * from topic where has_item=1 and item_count>=' + limit;

	_db.all(sql, function(err, rows) {
		for(var i = 0;i < rows.length;i++) {
			var item = rows[i];

			if(item.avatar) {
				item.img = item.name;
			}
			else {
				item.img = 0;
			}
		}
	    res.render("douban/index", {
	        rows: rows
	    });		
	})
}

exports.query = function(req, res) {
	var sql = req.query.sql;

	console.log('query=' + sql);
	_db.all(sql,  function(err, rows) {


		res.end(JSON.stringify(rows));	
	})
}


exports.topic = function(req, res) {
	var topicName = req.params.id;
	var len = req.query.len || 200;	
	if(!topicName || topicName.match('.map')) {
		res.end('');
		return;
	}
	var sql1 = 'SELECT id,name,desc FROM topic where name=?';
	console.log(topicName)
	_db.all(sql1, [topicName], function(err, rows) {

		var topic = rows[0];

		var sql2 = 'SELECT * FROM note where topic_id=? and title is not NULL' + ' and length(content)>' + len;

		_db.all(sql2, [topic.id], function(err, rows) {

		    res.render("douban/topic", {
		        rows: rows,
		        topic: topic
		    });		
		})			
	})
}

exports.note2 = function(req, res) {
	var noteId = req.params.id;

	console.log(noteId)
	if(!noteId || !noteId.match(/^\d+$/)) {
		res.end('404')
		return;
	}
	var sql = 'SELECT * FROM note where note_id=' + noteId;
	var folder;
	console.log(sql)
	_db.all(sql,  function(err, rows1) {

		var note = rows1[0];

	    res.render("douban/note", {
	        note: note
	    });			
	})

}
exports.note = function(req, res) {
	var noteId = req.params.id;
	var setAvatar = req.query.avatar;
	if(!noteId || !noteId.match(/^\d+$/)) {
		res.end('404')
		return;
	}
	var sql =  'SELECT * FROM note where note_id=' + noteId;

	console.log(sql)
	_db.all(sql,  function(err, rows1) {

		var note = rows1[0];
    	
    	var sql4 = 'SELECT * FROM topic WHERE id=?';
    	console.log('note_id=' + noteId);
    	_db.all(sql4, [note.topic_id], function(err, row3) {

    		var topic = row3[0];

			var sql2 = 'SELECT * FROM comment where note_id=' + noteId;

			var _db2;
			_db2 = _db2 || _db;
			_db2.all(sql2,  function(err, rows2) {

				if(!rows2 || !rows2.length) {
					rows2 = [];
				    res.render("douban/note", {
				        comments: rows2,
				        note: note
				    });
					return;
				}
				getUsers(rows2, 0);

				function getUsers(rows, i) {
					var i = i || 0;

					var item = rows[i];

					var sql3 = 'SELECT * FROM user WHERE user_id=?';

					_db.all(sql3, [item.author_id], function(err, rows3) {
					    
					    var user = rows3[0];
					    if(user){
						    item.user = {
						    	username: user.username,
						    	bio: user.bio,
						    	img: encodeURIComponent(user.username.replace(/[\|]/g, ' ')  + USER_SEP + user.user_id)
						    }

						    if(!user.avatar) {
						    	item.user.img = user.avatar;
						    }

					    	if(setAvatar) {
							    var filename = user.username + '#@#' + user.user_id + '.jpg';

							    var flag;
							    if(fs.existsSync(picFolder + filename)) {

							    	flag = null;
							    }
							    else {
							    	flag = -1;
							    }

						    	var sql4 = 'UPDATE user SET avatar=? WHERE id=?'

						    	_db.run(sql4, [flag, user.id], function(err) {

						    		var msg = '用户 ' + user.username + ' Avatar 已更新';

						    		console.log(msg.green);
						    	});
						    }					    
						}
						else {
							if(!user) {

								item.user = {
									username: '匿名用户',
									img: '0'
								}
							}
						}

						if(item.to_user_id && (item.to_user_id != -1)) {
							var sql5 = 'SELECT username FROM user WHERE user_id="' + item.to_user_id + '"';
							console.log(sql5);
							_db.all(sql5, function(err, rows) {
								var item2;
								if(!rows || !rows.length) {
									console.log(item.to_user_id);
									console.dir(rows);
									item2 = {
										username: '匿名用户'
									}
								}
								else {
									item2 = rows[0];
								}

								item.toUser = {
									username: item2.username
								}

								_end();
							})
						}
						else {
							_end();
						}


						function _end() {

						    if(i == (rows.length - 1)) {

							    res.render("douban/note", {
							        comments: rows2,
							        note: note
							    });
							}	
							else {
								getUsers(rows, ++i);
							}							
						}

					})
				}	
			})

    	});	
			
	})

}

exports.initial = function(req, res) {

	var query = req.query;
	var type = query.type;
	var index = 0;
	var total = 0;
	if(type == 'counter') {

		var tableName = 'topic';
		var sql = 'select topic.*,count(*) as total from topic join question where question.topic_id like ("%,"||topic.topic_id||",%") group by topic.topic_id order by total desc';
		
	    console.log('select=' + sql) 
        var msg = '正在查询 请稍候...';
        console.log(msg.yellow);	       	
		_db.all(sql,  function(err, rows) {
	        total = rows.length;
	        var msg = '一共查出 ' + rows.length + ' 条 topic';
	        console.log(msg.green);
			_update(rows);
		}); 

		function _update(rows) {
			
			var item = rows.shift();

			if(!item) {
		        
		        var msg = '所有 topic 计数 更新成功 table=' + tableName; 
		        onResponse(null,res,msg,null,null);
				return;
			}
			var tableName = 'topic';
			var sql = "UPDATE " + tableName + " SET item_count=? WHERE id=?";
			
		    console.log('update=' + sql)    	
			_db.run(sql, [item.total, item.id], function(err) {
		        var msg = 'progress: ' + (index+1) + '/' + total;
		        ++index;
		        console.log(msg.blue);
		        _update(rows);
			}); 

		}
	}
	else if(type == 'topic_pid') {


	}

}
exports.counter = function(req, res) {

	var query = req.query;
	var topicId = query.topicId;
	var total;
	var sql = 'SELECT count(*) as total FROM question WHERE topic_id like "%,' + topicId + ',%"';		
    console.log('select=' + sql) 
    var msg = '正在查询 请稍候...';
    console.log(msg.yellow);	       	
	_db.all(sql,  function(err, rows) {
        total = rows[0].total;
        var msg = '一共查出 ' + total + ' 条 question';
        console.log(msg.green);
		_update(rows);
	}); 

	function _update(rows) {
		
		var tableName = 'topic';
		var sql = "UPDATE " + tableName + " SET item_count=? WHERE topic_id=?";
		
	    console.log('update=' + sql)    	
		_db.run(sql, [total, topicId], function(err) {
	        
	        var msg = 'topic 计数=' + total + ' 更新成功 topicId=' + topicId; 
	        onResponse(null,res,msg,null,null);
			return;
		}); 
	}
	
}

exports.setTopic = function(req, res) {

	var query = req.query;
	var id = query.id;
	var has_item = query.value;
	var folder = query.folder;
	var desc = query.desc;
	var avatar = query.avatar;

	var tableName = 'topic';
	var values = [];
	var fields = [];
	if(has_item) {
		fields.push('has_item=?');
		values.push(has_item);
	}

	if(folder) {
		fields.push('folder=?');
		values.push(folder);
	}
	
	if(desc) {
		fields.push('desc=?');
		values.push(desc);		
		
	}
	if(avatar) {
		fields.push('avatar=?');
		values.push(parseInt(avatar));		
		
	}

	if(values.length) {
		values.push(id);
		var sql = "UPDATE " + tableName + " SET " + fields.join(',')  + " WHERE topic_id=?";
	    console.log('update=' + sql)    	
	    console.log('values=' + values.toString())    	
		_db.run(sql, values, function(err) {
	        
	        var msg = '更新 topic 成功 table=' + tableName + '  topic_id=' + (id || '');

	        return onResponse(err,res,msg,null,null);
		}); 
	}
	else {
		return res.end('');
	}
}
exports.addDescForQuestion = function(req, res) {

	var query = req.query;
	var desc = query.desc;
	var id = query.id;

	var tableName = 'question';
	var sql = "UPDATE " + tableName + " SET desc=? WHERE question_id= ?";
	
    console.log('update=' + sql)    	
	_db.run(sql, [desc, id], function(err) {
        
        var msg = '添加描述成功 table=' + tableName + '  question_id=' + (id || '');

        onResponse(err,res,msg,null,null);
	}); 
}

exports.addTopicForQuestion= function(req, res) {

	var body = req.body;
	var tags = body.tags;
	var questionId = body.questionId;

	var tableName = 'question';

	var idList = [];
	_process(tags);
	function _process(tags) {

		var tag = tags.shift();
		if(!tag) {

			// update
			_updateQuestion();
			return;
		}
		//console.dir(tag);
		idList.push(tag.id);
		var sql1 = 'SELECT id,has_item FROM topic WHERE topic_id=?';

		_db.all(sql1, [tag.id], function(err, rows) {

			if(rows.length) {
				var record = rows[0];
				//console.dir(record.has_item);
				if(record.has_item != 1) {
					_updateTopic(tag.id, function() {
						_process(tags);
					});

				}else {
					_process(tags);
				}
			}
			else {

				// add
				var sql2 = 'INSERT INTO topic (topic_id, name, has_item) VALUES(?,?,?)';

				_db.run(sql2, [tag.id, tag.name, 1], function(err) {

					if(err) {
						console.log(err.toString().red);
						return;
					}
					var msg = '添加 topic 成功 table=topic  topic=' + (tag.name || '');

					console.log(msg.green);

					_process(tags);
				});
			}
		})
	}

	function _updateQuestion() {

		var sql2 = 'SELECT topic_id FROM question WHERE question_id=?';

		_db.all(sql2,[questionId], function(err, rows) {

			if(err) {

				console.log(err.toString().red);
				return;
			}
			var record = rows[0];
			var topic_id = record.topic_id;
			var originList = topic_id.split(',');
			originList.shift();
			originList.pop();

			idList = idList.concat(originList);

			util.removeRepeat(idList);

			var sql = "UPDATE " + tableName + " SET topic_id=? WHERE question_id=?";
			var ids = ',' + idList.join(',') + ',';
		    console.log('update=' + sql)    	
			_db.run(sql, [ids, questionId], function(err) {
		        
		        var msg = '添加 topic 成功 table=' + tableName + '  question_id=' + (questionId || '');

		        onResponse(err,res,msg,null,null);
			}); 
		});
		
	}
	
	function _updateTopic(topicId, callback) {

		var sql = "UPDATE topic SET has_item=? WHERE topic_id=?";
	    console.log('update=' + sql)    	
		_db.run(sql, [1, topicId], function(err) {
	        
	        var msg = '更新 topic has_item 成功 table=topic topic_id=' + (topicId || '');
	        console.log(msg.green);
	        callback();
		}); 
		
	}
}
exports.addTopic = function(req, res) {

	var query = req.query;
	var name = query.name;
	var desc = query.desc;


	var tableName = 'topic';

	var sql1 = 'SELECT * FROM topic WHERE name=?';

	_db.all(sql1, [name] , function(err, rows) {

		if(rows.length) {
			var record = rows[0];
	        var msg = 'topic 已存在 table=' + tableName + '  topic=' + (record.name || '');

	        onResponse(null,res,msg,null,null);

			return;

		}
		else {
			var sql3 = "INSERT INTO " + tableName + " (name, has_item,desc) VALUES(?, ?,?)";
			
		    console.log('insert=' + sql3)    	
			_db.run(sql3, [name, 1, desc], function(err) {
		        
		        var msg = '添加成功 table=' + tableName + '  topic=' + (name || '');

		        onResponse(err,res,msg,null,null);
			}); 			
		}
	})

}

exports.addComment= function(req, res) {

	var body = req.body;

	var author_id = body.author_id;
	var content = body.content;
	var comment_id = body.comment_id;
	var reply = body.reply;
	var create_time = body.create_time;
	var note_id = body.note_id;

	var to_comment_id;
	var to_user_id;
	if(reply) {

		var sql2 = 'SELECT * FROM comment WHERE content=?';

		_db.all(sql2, [reply], function(err, rows) {

			if(rows.length) {
				to_comment_id = rows[0].comment_id;
				to_user_id = rows[0].author_id;

				_add();
			}
			else {
				_add();
			}
		})
	}
	else {
		_add();
	}

	function _add() {

		var tableName = 'comment';
		var sql = "INSERT INTO " + tableName + 
		" (author_id, content, comment_id, note_id, create_time, note_id, to_comment_id,to_user_id) VALUES(?,?, ?, ?,?,?,?,?)";
		
	    console.log('insert=' + sql)

		_db.run(sql, [author_id, content, comment_id, note_id, create_time, note_id, to_comment_id,to_user_id], function(err) {
	        
	        var msg = '添加成功 table=' + tableName + '  content=' + (content || '');

	        onResponse(err,res,msg,null,null);
		}); 		
	}
}
exports.addNote = function(req, res) {

	var body = req.body;

	var user_id = body.user_id;
	var content = body.content;
	var title = body.title;
	var tag = body.tag;
	var create_time = body.create_time;
	var note_id = body.note_id;
	var topic_id = body.topic_id;



	_add();


	function _add() {

		var tableName = 'note';
		var sql = "INSERT INTO " + tableName + 
		" (user_id, content, title, tag, create_time, note_id, topic_id) VALUES(?,?, ?, ?,?,?,?)";
		
	    console.log('insert=' + sql)

		_db.run(sql, [user_id, content, title, tag, create_time, note_id, topic_id], function(err) {
	        
	        var msg = '添加成功 table=' + tableName + '  title=' + (title || '');

	        onResponse(err,res,msg,null,null);
		}); 		
	}
}
exports.addShuo = function(req, res) {

	var body = req.body;

	var user_id = body.user_id;
	var content = body.content;

	var topic_id = body.topic_id;



	_add();


	function _add() {

		var tableName = 'note';
		var sql = "INSERT INTO " + tableName + 
		" (user_id, content,topic_id) VALUES(?,?, ?)";
		
	    console.log('insert=' + sql)

		_db.run(sql, [user_id, content, topic_id], function(err) {
	        
	        var msg = '添加成功 table=' + tableName;

	        onResponse(err,res,msg,null,null);
		}); 		
	}
}
exports.addUser = function(req, res) {

	var body = req.body;

	var user_id = body.user_id;
	var username = body.username;
	var intro = body.intro;
	var bio = body.bio;
	var create_time = body.create_time;
	var avatar = body.avatar;



	_add();


	function _add() {

		var tableName = 'user';
		var sql = "INSERT INTO " + tableName + 
		" (user_id, username, intro, bio, create_time, avatar) VALUES(?,?, ?, ?,?,?)";
		
	    console.log('insert=' + sql)

		_db.run(sql, [user_id, username, intro, bio, create_time, avatar], function(err) {
	        
	        var msg = '添加成功 table=' + tableName + '  username=' + (username || '');

	        onResponse(err,res,msg,null,null);
		}); 		
	}
}
// exports.addUser = function(req, res) {

// 	var query = req.query;
// 	var username = query.username;
// 	var userId = query.userId;
// 	var bio = query.bio;
// 	var avatar = query.avatar;

// 	exports.addUser2(res, username, userId, bio, avatar);	
// }

exports.addUser2 = function(res, username, userId, bio, avatar, answerCallback) {


	var tableName = 'user';
	var sql = "INSERT INTO " + tableName + " (username, user_id, bio, avatar) VALUES(?,?, ?, ?)";
	
    console.log('insert=' + sql)

	_db.run(sql, [username, userId, bio, avatar], function(err) {
        	
		if(err) {
			console.log(err.toString().red);

	       	_db.all('SELECT id from user where user_id=?', [userId], function(err,rows) {

			    var msg = '添加成功 table=' + tableName + '  username=' + (username || '');
	       		var id = rows[0].id;
	       		if(err) {
			        console.log(err.toString().red);
			    }
			    else {
			    	var msg = '用户 ' + userId + ' 已存在 id=' + id;
			    	console.log(msg.blue);

			    	answerCallback(id, true);
			    }
	       		
	       	})			
		}
		else {
	       	_db.all('SELECT last_insert_rowid() as last_id', function(err,rows) {

			    var msg = '添加成功 table=' + tableName + '  username=' + (username || '');
	       		
	       		if(res) {

			        onResponse(err,res,msg,null,null);

			    }
			    else {
			    	console.log(msg.green);

			    	answerCallback(rows[0].last_id);
			    }
	       		
	       	})
	    }
	}); 
}

exports.addQuestion= function(req, res) {

	var query = req.query;
	var title = query.title;
	var questionId = query.questionId;
	var topicId = ','+query.topicId+',';
	var has_item = query.has_item;
	var folder = query.folder;

	var tableName = 'question';


	var sql1 = 'SELECT * FROM ' + tableName + ' WHERE question_id=?';

	_db.all(sql1, [questionId], function(err, rows) {

		if(rows.length) {
			var item = rows[0];

			if(item.topic_id.match(topicId)) {
				err = new Error('问题 ' + title + '重复 question_id=' + questionId);
				onResponse(err,res,null,null,null);
			}
			else {

				var sql3 = 'UPDATE ' + tableName + 
				' SET topic_id="' + item.topic_id + query.topicId + '," WHERE question_id=?';
				console.log('update=' + sql3);
				_db.run(sql3, [questionId], function(err) {
					err = new Error('问题 ' + title + '重复 并已更新 question_id=' + questionId);
					onResponse(err,res,null,null,null);
				})
			}
			
		}
		else {
			var sql2 = "INSERT INTO " + tableName + " (title, question_id, topic_id, pic_folder) VALUES(?, ?, ?, ?)";
			console.log('insert=' + sql2)
			
			_db.run(sql2, [title, questionId, topicId, folder], function(err) {
		        
		        var msg = '添加成功 table=' + tableName + '  question=' + (title || '');

		        onResponse(err,res,msg,null,null);
			}); 
		}
	})
 

}