module.exports = function (grunt) {

	/*
	安装grunt客户端
	-------------------
	npm install -g grunt-cli
	npm install -g grunt-init
	npm init (creates a `package.json` file)

	添加grunt跟grunt插件
	---------------------
	npm install grunt --save-dev
	npm install grunt-contrib-watch --save-dev
	npm install grunt-contrib-jshint --save-dev
	npm install grunt-contrib-uglify --save-dev
	npm install grunt-contrib-requirejs --save-dev
	npm install grunt-contrib-sass --save-dev
	npm install grunt-contrib-imagemin --save-dev
	npm install grunt-contrib-htmlmin --save-dev
	npm install grunt-contrib-connect --save-dev
	npm install grunt-contrib-jasmine --save-dev
	npm install grunt-template-jasmine-requirejs --save-dev
	npm install grunt-shell --save-dev
	npm install grunt-prompt --save-dev
	 */

	// 项目配置
	grunt.initConfig({

		// 加载package.json并保存,一般可以存一些配置
		pkg : grunt.file.readJSON('package.json'),

		// 测试服务器
		connect : {
			test : {
				port : 8000
			}
		},

		jasmine : { //测试

			src : ['app/**/*.js', '!app/release/**'], //当已经release后，就不需要执行测试了。使用！操作符
			options : {
				host : 'http://127.0.0.1:8000/',
				specs : 'specs/**/*Spec.js', //用例
				helpers : ['specs/helpers/*Helper.js'], //各种函数
				template : require('grunt-template-jasmine-requirejs'), //加载requirejs
				templateOptions : {
					requireConfig : {
						baseUrl : './app/',
						mainConfigFile : './app/main.js'
					}
				}
			}
		},

		jshint : { //过jshint
			files : ['Gruntfile.js', 'app/**/*.js', '!app/release/**', 'modules/**/*.js', 'specs/**/*Spec.js'], //同样release的代码我们也不需要测试
			options : {
				curly : true,
				eqeqeq : true,
				immed : true,
				latedef : true,
				newcap : true,
				noarg : true,
				sub : true,
				undef : true,
				boss : true,
				eqnull : true,
				browser : true,

				globals : { //全局变量
					// AMD
					module : true,
					require : true,
					requirejs : true,
					define : true,

					// 环境变量
					console : true,

					//框架
					$ : true,
					jQuery : true,

					// 测试器
					sinon : true,
					describe : true,
					it : true,
					expect : true,
					beforeEach : true,
					afterEach : true
				}
			}
		},

		requirejs : { //加载requirejs
			compile : {
				options : {
					baseUrl : './app',
					mainConfigFile : './app/main.js',
					dir : './app/release/',
					fileExclusionRegExp : /^\.|node_modules|Gruntfile|\.md|package.json/,
					// optimize: 'none',
					modules : [{
							name : 'main'
							// include: ['module'],
							// exclude: ['module']
						}
					]
				}
			}
		},

		sass : { //sass
			dist : {
				options : {
					style : 'compressed',
					require : ['./assets/styles/sass/helpers/url64.rb']
				},
				expand : true,
				cwd : './app/styles/sass/',
				src : ['*.scss'],
				dest : './app/styles/',
				ext : '.css'
			},
			dev : {
				options : {
					style : 'expanded',
					debugInfo : true,
					lineNumbers : true,
					require : ['./app/styles/sass/helpers/url64.rb']
				},
				expand : true,
				cwd : './app/styles/sass/',
				src : ['*.scss'],
				dest : './app/styles/',
				ext : '.css'
			}
		},

		// 压缩图片`optimizationLevel` 只对png图片有效
		imagemin : {
			png : {
				options : {
					optimizationLevel : 7
				},
				files : [{
						expand : true,
						cwd : './app/images/',
						src : ['**/*.png'],
						dest : './app/images/compressed/',
						ext : '.png'
					}
				]
			},
			jpg : {
				options : {
					progressive : true
				},
				files : [{
						expand : true,
						cwd : './app/images/',
						src : ['**/*.jpg'],
						dest : './app/images/compressed/',
						ext : '.jpg'
					}
				]
			}
		},

		htmlmin : { //压缩html
			dist : {
				options : {
					removeComments : true,
					collapseWhitespace : true,
					removeEmptyAttributes : true,
					removeCommentsFromCDATA : true,
					removeRedundantAttributes : true,
					collapseBooleanAttributes : true
				},
				files : {
					// Destination : Source
					'./index-min.html' : './index.html'
				}
			}
		},

		// 跑起来
		watch : {
			files : ['<%= jshint.files %>', '<%= jasmine.options.specs %>', '<%= sass.dev.src %>'],
			tasks : 'default'
		},
		/*
		 *  git提交时的信息
		 *  Use 'git add .' and 'git commit -am' to commit changes
		 */

		prompt : {
			commit : {
				options : {
					questions : [{
							config : 'echo.input',
							type : 'input',
							message : 'Commit Message',
							validate : function (value) {
								if (value === '') {
									return 'A value is required.';
								}
								return true;
							}
						}
					]
				}
			}
		},
		//addall任务添加文件,commit任务提交文件
		shell : {
			addall : {
				command : 'git add .',
				options : {
					stdout : true
				}
			},

			commit : {
				command : function () {
					return ('git commit -am' + grunt.config('echo.input') + ';');
				},
				options : {
					stdout : true
				}
			}
		},

	});
	// 加载插件
	require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

	// git
	grunt.registerTask('git', ['prompt', 'shell']);

	// grunt时的默认任务
	grunt.registerTask('default', ['jshint', 'connect', 'jasmine', 'sass:dev']);

	// 单元测试
	grunt.registerTask('test', ['connect', 'jasmine']);

	// release的过程
	grunt.registerTask('release', ['jshint', 'jasmine', 'requirejs', 'sass:dist', 'imagemin', 'htmlmin']);

};