var CONFIG = {
    pageSize: 50,
    slideInterval: 3000
}
var subcats1 = 
			[
			{
				id: -1,
				name: '全部'
			},
			{
				id: -2,
				name: '收藏'
			},
			{
				id: -3,
				name: '单词'
			},			
			{
				id: 0,
				name: '经典语录'
			},
			{
				id: 1,
				name: '爱情语录'
			},
			{
				id: 1.5,
				name: '英语'
			},
			{
				id: 2,
				name: '名人名言'
			},
			{
				id: 3,
				name: '台词'
			},
			{
				id: 4,
				name: '歌词'
			},
			{
				id: 5,
				name: '段子'
			},
			{
				id: 6,
				name: '搞笑语录'
			},
			{
				id: 7,
				name: '内涵语录'
			},
			{
				id: 8,
				name: '谜语'
			},
			{
				id: 9,
				name: '签名'
			},
			{
				id: 10,
				name: '短信'
			},
			{
				id: 11,
				name: '生活感悟'
			},
			{
				id: 12,
				name: '诗词'
			}
			]

            var subcats2 = 
			[
			{
				id: -1,
				name: '全部'
			},
			{
				id: -2,
				name: '收藏'
			},
			{
				id: 0,
				name: '网易云音乐'
			},
			{
				id: 1,
				name: '豆瓣'
			},
			{
				id: 2,
				name: '新闻'
			},
			{
				id: 3,
				name: '其它'
			},
			{
				id: 4,
				name: '时光'
			}			
			]
            
            
            var subcats3 = 
            [
            {
                id: -1,
                name: '全部'
            },
            {
                id: -2,
                name: '收藏'
            },
            {
                id: 0,
                name: 'HTML/CSS/JS'
            },
            {
                id: 1,
                name: 'ES6/H5/CSS3'
            },
            {
                id: 2,
                name: 'Angular/Vue/React'
            },
            {
                id: 3,
                name: 'NodeJS'
            },            
            {
                id: 13,
                name: '框架'
            },            
            {
                id: 14,
                name: '小程序'
            },            
            {
                id: 15,
                name: '前端圈'
            },            
            {
                id: 4,
                name: '数据库'
            },
            {
                id: 5,
                name: 'Java'
            },
            {
                id: 6,
                name: 'Linux'
            }            
,
            {
                id: 7,
                name: '编程周边'
            }            
            ]             
            var subcats31 = 
			[
			{
				id: -1,
				name: '全部'
			},
			{
				id: -2,
				name: '收藏'
			},
			{
				id: 0,
				name: '马克思主义原理'
			},
					
			]           
            var subcats4 = 
			[
			{
				id: -1,
				name: '全部'
			},
            {
                id: -2,
                name: '收藏'
            },
			{
				id: -3,
				name: '美好万物'
			},
			{
				id: 10,
				name: '时间轴'
			},
			{
				id: 11,
				name: '技巧'
			},
			{
				id: 12,
				name: '文艺'
			},
			{
				id: 13,
				name: '人生路标'
			}		
			]
            var subcats5 = 
			[
			{
				id: -1,
				name: '全部'
			},
			{
				id: -2,
				name: '收藏'
			},
			
			{
				id: -4,
				name: '百科',
			},

			{
				id: -3,
				name: '新闻',
			},
			{
				id: 0,
				name: '短篇'
			},
			{
				id: 1,
				name: '长篇'
			},
			{
				id: 2,
				name: '鬼故事'
			},
			{
				id: 3,
				name: '散文'
			}			
			,
			{
				id: 4,
				name: '剧情'
			}			
			,
			{
				id: 5,
				name: '专辑'
			}			
			,
			{
				id: 6,
				name: '图书'
			}			
			]
            window.AppDATA = {
    subcats: [
        {
            name: 'sentence',
            cnName:'语录123',
            list: subcats1

        },
        {
            name: 'comment',
            cnName:'言论',
            list: subcats2

        },
        {
            name: 'programming',
            cnName:'程式',
            list: subcats3

        },
        {
            name: 'treasure',
            cnName:'Treasure',
            list: subcats4

        },
        {
            name: 'story',
            cnName:'故事',
            list: subcats5

        },

    ]
}

var DataCONFIG = {
    list: [
    {
        name: '语录2',
        list: [
            {
                name: '语录',
                tableName: 'sentence',
                typeMap: {
                    '-3': '单词',
                    '-4': '每日一句',
                    0: '经典语录',
                    100: '笑话',
                    1: '爱情语录',
                    1.5: '英语',
                    2: '名人名言',
                    3: '台词',
                    4: '歌词',
                    5: '段子',
                    6: '搞笑语录',
                    7: '内涵语录',
                    8: '谜语',
                    9: '签名',
                    10: '短信',
                    11: '生活感悟',
                    12: '诗词',
                    13: '读书笔记'
                }
            }       
        ]
    },
    {
        name: 'Treasure',
        list: [
            {
                name: 'treasure',
                tableName: 'treasure',
                typeMap: {
                    '10': '时间轴',
                    11: '技巧',
                    12: '文艺',
                    13: '人生路标',
                    14: '不良习惯',
                    15: '梦境',
                    '-3': '美好万物'
                }
            }       
        ]
    },
    {
        name: 'Programming',
        list: [
            {
                name: 'programming',
                tableName: 'programming',
                typeMap: {
                    '0': 'HTML/CSS/JS',
                    1: 'ES6/H5/CSS3',
                    2: 'Angular/Vue/React',
                    3: 'NodeJS',
                    13: '框架',
                    14: '小程序',
                    15: '前端圈',
                    4: '数据库',
                    5: 'Java',
                    6: 'Linux',
                    7: '编程周边'
                }
            }       
        ]
    },
    {
        name: '知识',
        list: [
            {
                name: 'knowledge',
                tableName: 'knowledge',
                typeMap: {
                    '0': '马克思主义原理',
                    
                }
            }       
        ]
    },
    {
        name: '评论',
        list: [{
            name: '评论',
            tableName: 'comment',
            typeMap: {
                0: '网易云音乐',
                1: '豆瓣',
                2: '新闻',
                3: '其它',
                4: '拼命玩游戏',
                5: '知乎'
            }
        }]
    },
    {
        name: '笑话',
        list: 
        [
        {
            name: '笑话',
            tableName: 'joke',
            typeMap: {
                0: '冷笑话',
                1: '糗笑话',
                2: '经典笑话',
                3: '黄色笑话',
                4: '校园笑话',
                5: '内涵笑话'
            }
        }        
        ]
    },
    {
        name: '说说',
        list: 
        [
            {
                name: '说说',
                tableName: 'note',
                typeMap: {
                    0: '记录',
                    1: '感觉',
                    2: '疑问',
                    3: '灵感',
                    4: '观点',
                    5: 'void'
                }
            }
        ]
    },
    {
        name: '故事',
        list: 
        [
            {
                name: '故事',
                tableName: 'story',
                typeMap: {
                    '-4': '百科',
                    '-3': '新闻',
                    0: '短篇',
                    1: '长篇',
                    2: '鬼故事',
                    3: '散文',
                    4: '剧情',
                    5: '专辑',
                    6: '图书'
                }
            }        
        ]
    },
    {
        name: '文章',
        list: 
        [
            {
                name: '邻居的耳朵',
                tableName: 'artical',
                typeMap: {
                    0: '未分类',
                    1: '邻居的耳朵'
                }
            }        
        ]
    },
    {
        name: '教程',
        list: 
        [
        {
            name: 'w3cfuns',
            tableName: 'w3cfuns',
            typeMap: {
                0: '未分类',
                1: 'HTML/CSS',
                2: 'JavaScript',
                3: 'Node.js',
                4: '手机移动',
                5: '前端安全',
                6: '性能优化',
                7: '类库框架',
                8: '开发调试',
                9: '浏览器',
                10: '面试经验',

                11: '互联网事',
                12: '前端资源',
                13: '经验技巧',
                14: '设计创意'
            }
        }        
        ]
    },
    {
        name: '简书',
        list: 
        [
            {
                name: '简书热文',
                tableName: 'jianshu',
                typeMap: {
                    1: '简书热文',
                    2: '读书笔记',
                    3: '生活着',
                    4: '短篇小说',
                    5: '一直写到老的故事',
                    6: '故事和诗，你总得有一样'

                }
            },  
            {
                name: '随笔集',
                tableName: 'jianshu2',
                typeMap: {
                    1: '随笔集',
                    2: '我想到的爱情是什么样子？',
                    3: '青春'
                }
            },
            {
                name: '路人故事',
                tableName: 'jianshu3',
                typeMap: {
                    1: '路人故事',
                    2: '大学生世界',
                    3: '游戏',
                    4: '自成诗歌'
                }
            },
            {
                name: '小说的各种小说',
                tableName: 'jianshu4',
                typeMap: {
                    1: '小说的各种小说',
                    2: '你才不知道那些故事有多好听'
                }
            }                    ,
            {
                name: '连载小说1',
                tableName: 'jianshu5',
                typeMap: {
                    1: '连载小说'
                }
            },
            {
                name: '连载小说2',
                tableName: 'jianshu6',
                typeMap: {
                    1: '连载小说'
                }
            },
            {
                name: '知了 IT',
                tableName: 'jianshu7',
                typeMap: {
                    1: '知了 IT',
                    2: '程序员'
                }
            },
            {
                name: '首页投稿1',
                tableName: 'jianshu8',
                typeMap: {
                    1: '首页投稿'
                }
            },
            {
                name: '首页投稿2',
                tableName: 'jianshu9',
                typeMap: {
                    1: '首页投稿'
                }
            },
            {
                name: '首页投稿3',
                tableName: 'jianshu10',
                typeMap: {
                    1: '首页投稿'
                }
            },
            {
                name: '首页投稿4',
                tableName: 'jianshu11',
                typeMap: {
                    1: '首页投稿'
                }
            }                  

        ]
    },    
    {
        name: '句子',
        list: 
        [
            {
                name: '句子迷',
                tableName: 'juzimi',
                typeMap: {
                }
            },               
            {
                name: '语录网',
                tableName: 'yuluwang',
                typeMap: {
                    1: '名人经典语录',
                    2: '伤感的句子',
                    3: '经典爱情语录',
                    4: '经典搞笑语录',
                    5: '经典励志语录',
                    6: '个性说说',
                    7: '心情说说'
                }
            }                
        ]
    },    
    {
        name: '豆瓣',
        list: 
        [
            {
                name: '图书1',
                tableName: 'douban_book1',
                typeMap: {
                    1: '小说',
                    2: '外国文学',
                    3: '文学',
                    4: '随笔',
                    5: '中国文学',
                    6: '经典',
                    7: '日本文学',
                    8: '散文',
                    9: '诗歌',
                    10: '童话',
                    11: '杂文',
                    12: '儿童文学',
                    13: '古典文学',
                    14: '漫画',
                    15: '绘本',
                    16: '推理',
                    17: '青春',
                    18: '言情',
                    19: '科幻',
                    20: '悬疑',
                    21: '武侠',
                    22: '奇幻',
                    23: '历史',
                    24: '心理学',
                    25: '哲学',
                    26: '传记',
                    27: '文化',
                    28: '爱情',
                    29: '旅行',
                    30: '生活',
                    31: '成长',
                    32: '励志',
                    33: '科普',
                    34: '互联网',
                    35: '编程'
                }
            },{
                name: '电影1',
                tableName: 'douban_movie1',
                typeMap: {
                    1: '爱情'
                }
            },{
                name: '音乐1',
                tableName: 'douban_music1',
                typeMap: {
                    1: '流行',
                    2: '纯音乐',
                    3: '摇滚',
                    4: '民谣',
                    5: '古典',
                    6: '香港'
                }
            }               
        ]
    }
    ]
}