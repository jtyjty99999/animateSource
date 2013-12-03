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
    */

    // 项目配置
    grunt.initConfig({

        // 加载package.json并保存,一般可以存一些配置
        pkg: grunt.file.readJSON('package.json'),

		
		
		/*  
    *  Prompt for git commit message
    *  Use 'git add .' and 'git commit -am' to commit changes
    */
    
    prompt: {
      commit: {
        options: {
          questions: [
            {
              config: 'echo.input',
              type: 'input',
              message: 'Commit Message',
              validate: function(value) {
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

    shell: {
      addall: {
        command: 'git add .',
        options: {
          stdout: true
        }
      },

      commit: {
        command: function() {
                      return ('git commit -am' + grunt.config('echo.input') + ';');
                    },
        options: {
          stdout: true
        }
        }
      },
		
		
		
		
		
    
    });
    // 加载插件
	require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    // git
    grunt.registerTask('git',['prompt', 'shell']);


};