

var OBJTable= {
	commonSQL: '( id integer primary key, content TEXT,dateposted DATETIME, type int, item varchar(100), tag varchar(32) )',
	doubanSQL: '( id integer primary key, subject_id int unique, code int, content TEXT,dateposted DATETIME, type int, item varchar(100), tag varchar(32))',
	defaultDB: 'mynote',
	list: [
		// {
		// 	'name': 'tutorial',
		// 	'db': 'mynote2'
		// },
		{
			'name': 'note2',
		},
		{
			'name': 'artical',
			'db': 'myartical'
		},
		{
			'name': 'sentence',
		},
		{
			'name': 'joke',
		},
		{
			'name': 'comment',
		},
		{
			'name': 'programming',
			'db': 'mynote'
		},
		{
			'name': 'treasure',
			'db': 'mynote'
		},
		{
			'name': 'story',
		},

		//
		{
			'name': 'w3cfuns',
			'db': 'w3cfuns'
		},

		{
			'name': 'jianshu',
			'db': 'jianshu'
		},

		{
			'name': 'jianshu2',
			'db': 'jianshu2'
		},

		{
			'name': 'jianshu3',
			'db': 'jianshu3'
		},

		{
			'name': 'jianshu4',
			'db': 'jianshu4'
		},
		{
			'name': 'jianshu5',
			'db': 'jianshu5'
		},
		{
			'name': 'jianshu6',
			'db': 'jianshu6'
		},
		{
			'name': 'jianshu7',
			'db': 'jianshu7'
		},
		{
			'name': 'jianshu8',
			'db': 'jianshu8'
		},
		{
			'name': 'jianshu9',
			'db': 'jianshu9'
		},
		{
			'name': 'jianshu10',
			'db': 'jianshu10'
		},
		{
			'name': 'jianshu11',
			'db': 'jianshu11'
		},

		{
			'name': 'juzimi',
			'db': 'juzimi'
		},

		{
			'name': 'yuluwang',
			'db': 'yuluwang'
		},

		{
			'name': 'douban_book1',
			'db': 'douban_book1',
			'type': 'douban'
		},

		{
			'name': 'douban_movie1',
			'db': 'douban_movie1',
			'type': 'douban'
		},

		{
			'name': 'douban_music1',
			'db': 'douban_music1',
			'type': 'douban'
		}
	],

	tableAlias: {
		note: 'note2'
	}
}

var OBJDatabase = {
	dir: 'database',
	list: [
		{
			filename: 'mynote'
		},
		{
			filename: 'myartical'
		},
		// {
		// 	filename: 'mynote2'
		// },
		{
			filename: 'w3cfuns'
		},
		{
			filename: 'jianshu'
		},
		{
			filename: 'jianshu2'
		},
		{
			filename: 'jianshu3'
		},
		{
			filename: 'jianshu4'
		},
		{
			filename: 'jianshu5'
		},
		{
			filename: 'jianshu6'
		},
		{
			filename: 'jianshu7'
		},
		{
			filename: 'jianshu8'
		},
		{
			filename: 'jianshu9'
		},
		{
			filename: 'jianshu10'
		},
		{
			filename: 'jianshu11'
		},
		{
			filename: 'juzimi'
		},
		{
			filename: 'yuluwang'
		},
		{
			filename: 'douban_book1'
		},
		{
			filename: 'douban_movie1'
		},
		{
			filename: 'douban_music1'
		},
		{
			filename: 'zhihu1',
			dir: 'zhihu'
		},
		{
			filename: 'group1',
			dir: 'douban'
		}
	],

	zhihu: [
		{
			db: '2',
			topics: 
			[
				{
					id: 19564412,
					name: '恋爱'
				},
				{
					id: '19552204',
					name: '性生活'
				}
			]
		}
	]
}

var OBJ = {
	OBJTable: OBJTable,
	OBJDatabase: OBJDatabase
}

exports.config = OBJ;