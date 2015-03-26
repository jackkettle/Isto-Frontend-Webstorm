/**
 * Created by Jack Kettle on 29/10/2014.
 */

module.exports = function (grunt) {
    grunt.initConfig({

        // Compile specified less files
        less: {
            compile: {
                options: {
                    // These paths are searched for @imports
                    paths: ["less/"]
                },
                files: {
                    "src/css/main.css": "src/less/style.less"
                }
            }
        },
        
        // concat all js files
        concat: {
          js: {
            src: ['src/js/dev/main.js', 'src/js/dev/**/*.js'],
            dest: 'src/js/dest/concat.js'
          }
        },
        
        // minifyjs
        uglify: {
            options: {
                compress: false,
                mangle: false,
                beautify: true
            },
            js: {
                files: {
                'src/js/dest/main.min.js': ['src/js/dest/concat.js']
                }
            }
        },
        
        ftpush: {
            build: {
                auth: {
                    host: 'ftp1.reg365.net',
                    "username": "isto.ie",
                    "password": ""
                },
                simple: true,
                src: 'src/',
                dest: 'web/'
            }
        },
        
        watch: {
            styles: {
                files: ["**/*.less"],
                tasks: "less",
                options: {
                    livereload: true
                }

            },
            scripts: {
                files: ["src/js/dev/**"],
                tasks: ['concat', 'uglify']
            }
        }

    });

    // Load tasks so we can use them
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ftpush');

    // The dev task will be used during development
    grunt.registerTask("default", ["watch"]);
};