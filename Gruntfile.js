/*global module:false*/
module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        options: {
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['js/**/*.js', 'test/**/*.js']
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS']
            },
            // run this task inside watch
            continuous: {
                background: true
            },
            // single run
            unit: {
                singleRun: true
            }
        },
        regarde: {
            lib_test: {
                files: '<%= options.lib_test.src %>',
                tasks: ['karma:continuous:run']
            }
        }
    });

    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('watch', ['karma:continuous', 'regarde']);
    // Default task.
    grunt.registerTask('default', ['test']);

};
