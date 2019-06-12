var sqlite3 = require('../utils/sqlite3');
var util = global.util;
var dbs = global.dbs;
var onResponse = global.onResponse;
var DBNAME = 'zhihu1';
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
var picFolder = 'M:\\Nature\\CodeForest\\_LAB\\project-lab\\mynote\\public\\resources\\zhihu\\user\\'
exports.index = function(req, res) {
	var limit = req.query.limit || 30;
	//var sql = 'SELECT * FROM topic where name like "%阅读%"';
	var sql = 'select * from topic where has_item=1 and item_count>' + limit;

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
	    res.render("zhihu/index", {
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
	var topicId = req.params.id;
	if(!topicId || !topicId.match(/^\d+$/)) {
		res.end('');
		return;
	}
	var sql1 = 'SELECT name,avatar,desc FROM topic where topic_id=?';

	_db.all(sql1, [topicId], function(err, rows) {

		var topic = rows[0];
		if(topic.avatar) {
			topic.img = topic.name;
		}
		else {
			topic.img = 0;
		}		
		var str = ',' + topicId +',';
		var sql2 = 'SELECT * FROM question where topic_id like "%' + str + '%"';

		_db.all(sql2,  function(err, rows) {

		    res.render("zhihu/topic", {
		        rows: rows,
		        topic: topic
		    });		
		})			
	})
}

exports.question = function(req, res) {
	var questionId = req.params.id;
	console.log(questionId)
	if(!questionId || !questionId.match(/^\d+$/)) {
		res.end('404')
		return;
	}
	var sql = 'SELECT * FROM question where question_id=' + questionId;
	var folder;
	console.log(sql)
	_db.all(sql,  function(err, rows1) {

		var question = rows1[0];
		folder = question.pic_folder;

		var sql2 = 'SELECT * FROM answer where question_id =' + questionId;

		_db.all(sql2,  function(err, rows2) {
			
			if(!rows2.length) {

			    res.render("zhihu/question", {
			        rows: [],
			        question: question,
			        folder: folder
			    });			

			    return;	
			}
			getUsers(rows2, 0);

			function getUsers(rows, i) {
				var i = i || 0;

				var item = rows[i];

				var sql3 = 'SELECT * FROM user WHERE id=?';

				_db.all(sql3, [item.user_id], function(err, rows3) {
				    
				    var user = rows3[0];
				    if(user){
					    item.user = {
					    	username: user.username,
					    	bio: user.bio,
					    	img: encodeURIComponent(user.username + USER_SEP + user.user_id)
					    }
					}
					else {
						if(item.user_id == -1) {

							item.user = {
								username: '匿名用户',
								img: '-1'
							}
						}
					}
				    if(i == (rows.length - 1)) {
					    res.render("zhihu/question", {
					        rows: rows2,
					        question: question,
					        folder: folder
					    });
					}	
					else {
						getUsers(rows, ++i);
					}

				})
			}	
		})			
	})

}
exports.answer = function(req, res) {
	var answerId = req.params.id;
	var setAvatar = req.query.avatar;
	if(!answerId || !answerId.match(/^\d+$/)) {
		res.end('404')
		return;
	}
	var sql = 'SELECT * FROM answer where answer_id =' + answerId;

	console.log(sql)
	_db.all(sql,  function(err, rows1) {

		var answer = rows1[0];
    	
    	var sql4 = 'SELECT pic_folder,title,main_topic FROM question WHERE question_id=?';

    	_db.all(sql4, [answer.question_id], function(err, row3) {

    		var question = row3[0];

    		var folder = question.pic_folder;

			var sql2 = 'SELECT * FROM comment where answer_id=' + answerId;

			var _db2;
			if(question.main_topic) {
				_db2 = dbTopics[question.main_topic];
			}

			_db2 = _db2 || _db;
			_db2.all(sql2,  function(err, rows2) {

				answer.author_id = answer.user_id;
				rows2.unshift(answer);
				getUsers(rows2, 0);

				function getUsers(rows, i) {
					var i = i || 0;

					var item = rows[i];

					var sql3 = 'SELECT * FROM user WHERE id=?';

					_db.all(sql3, [item.author_id], function(err, rows3) {
					    
					    var user = rows3[0];
					    if(user){
						    item.user = {
						    	username: user.username,
						    	bio: user.bio,
						    	img: encodeURIComponent(user.username + USER_SEP + user.user_id)
						    }

						    if(user.avatar) {
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
							if(item.author_id == -1) {

								item.user = {
									username: '匿名用户',
									img: '-1'
								}
							}
						}

						if(item.to_user_id && (item.to_user_id != -1)) {
							var sql5 = 'SELECT username FROM user WHERE id=' + item.to_user_id;

							_db.all(sql5, function(err, rows) {

								var item2 = rows[0];

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

							    res.render("zhihu/answer", {
							        rows: rows2,
							        question: question,
							        folder: folder
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
	if(query.pid){
		pid = ',' + query.pid + ',';
	}
	else {
		pid = null;
	}
	var topicId = query.topicId ;

	var tableName = 'topic';

	var sql1 = 'SELECT * FROM topic WHERE topic_id=?';

	_db.all(sql1, [topicId] , function(err, rows) {

		if(rows.length) {
			var record = rows[0];
			if(!query.pid) {
		        var msg = 'topic 已存在 table=' + tableName + '  topic=' + (record.name || '');

		        onResponse(null,res,msg,null,null);
		        return;
			}
			
			if(!record.pid) {
				record.pid = ',';
			}

			if(record.pid.match(pid)) {
		        var msg = 'pid 已存在 table=' + tableName + '  topic=' + (record.name || '');

		        onResponse(null,res,msg,null,null);
		        return;
			}
			else {
				var sql2 = "UPDATE " + tableName + " SET pid=? WHERE id=?";
				pid = record.pid + query.pid + ',';
			    console.log('update=' + sql2)    	
				_db.run(sql2, [pid, record.id], function(err) {
			        
			        var msg = '更新 pid 成功 table=' + tableName + '  topic=' + (record.name || '');

			        onResponse(err,res,msg,null,null);
				}); 
			}

		}
		else {
			var sql3 = "INSERT INTO " + tableName + " (name, topic_id, pid) VALUES(?, ?, ?)";
			
		    console.log('insert=' + sql3)    	
			_db.run(sql3, [name, topicId, pid], function(err) {
		        
		        var msg = '添加成功 table=' + tableName + '  topic=' + (name || '');

		        onResponse(err,res,msg,null,null);
			}); 			
		}
	})

}

exports.addComment= function(req, res) {

	var body = req.body;

	var author = body.author;
	var toUser = body.toUser;
	var comment = body.comment;
	var commentDB = dbs[body.db];
	if(!commentDB) {
		commentDB = _db;
	}
	var result = {};
	if(author && (typeof(author) == 'object')) {
		exports.addUser2(null, author.username, author.userId, author.bio, author.avatar,
		 function(authorId, isExist) {
		 	if(isExist) {
		 		result.hasAuthor = true;
		 	}
		 	_add1(authorId);

		});
	}
	else {
		
		_add1(-1);
	}

	function _add1(authorId) {

		if(toUser && (typeof(toUser) == 'object') && (toUser.username!='匿名用户')) {
			exports.addUser2(null, toUser.username, toUser.userId, toUser.bio,
			toUser.avatar, function(toUserId,isExist) {
			 	if(isExist) {
			 		result.hasToUser = true;
			 	}			
				_add2(authorId, toUserId);
			});
		}
		else {
			_add2(authorId,-1);
		}


		function _add2(authorId, toUserId) {
			toUserId = toUserId || 0;
			var tableName = 'comment';
			var sql = "INSERT INTO " + tableName + 
			" (answer_id, comment_id, author_id, to_comment_id, to_user_id, create_time, content) VALUES(?,?, ?, ?,?,?,?)";
			
		    console.log('insert=' + sql)

			commentDB.run(sql, [comment.answerId,  comment.commentId, authorId, 
				comment.toCommentId, toUserId, comment.createTime,comment.content], function(err) {
		        
		        var msg = '添加成功 table=' + tableName + '  commentId=' + (comment.commentId || '');

		        onResponse(err,res,msg,null,null, result);
			}); 			
		}
	}
}
exports.addAnswer = function(req, res) {

	var body = req.body;

	var user = body.user;
	var answer = body.answer;

	if(user != -1) {
		exports.addUser2(null, user.username, user.userId, user.bio, user.avatar, function(userId) {


			_add(userId);
		});
	}
	else {

		_add(-1);
	}

	function _add(userId) {

		var tableName = 'answer';
		var sql = "INSERT INTO " + tableName + 
		" (answer_id, token, question_id, user_id, content) VALUES(?,?, ?, ?,?)";
		
	    console.log('insert=' + sql)

		_db.run(sql, [answer.answerId, answer.token, answer.questionId, userId, answer.content], function(err) {
	        
	        var msg = '添加成功 table=' + tableName + '  answerId=' + (answer.answerId || '');

	        onResponse(err,res,msg,null,null);
		}); 		
	}
}
exports.addUser = function(req, res) {

	var query = req.query;
	var username = query.username;
	var userId = query.userId;
	var bio = query.bio;
	var avatar = query.avatar;

	exports.addUser2(res, username, userId, bio, avatar);	
}

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