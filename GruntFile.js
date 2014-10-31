/**
 * Created by Jack Kettle on 29/10/2014.
 */

module.exports = function (grunt) {
    grunt.initConfig({

        // Automatically run a task when a file changes
        watch: {
            styles: {
                files: ["**/*.less"],
                tasks: "less",
                options: {
                    livereload: true
                }

            },
            html: {
                files: ['**/*.htm','**/*.html'],
                options: {
                    livereload: true
                }
            }
        },

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
        }
    });

    // Load tasks so we can use them
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-less");

    // The dev task will be used during development
    grunt.registerTask("default", ["watch"]);
};