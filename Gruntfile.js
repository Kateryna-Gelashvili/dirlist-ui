module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                expand: true,
                cwd: 'app/pictures/',
                src: '*',
                dest: 'dist/'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'app/libraries/ngToast/ngToast.js',
                    'app/scripts/dirApp.js',
                    'app/scripts/dirController.js',
                    'app/scripts/LoginController.js'
                ],
                dest: 'dist/app.js'
            }
        },
        concat_css: {
            all: {
                src: ["app/styles/*.css", "app/libraries/ngToast/*.css"],
                dest: "dist/styles.css"
            }
        },
        uglify: {
            build: {
                src: 'dist/app.js',
                dest: 'dist/app.min.js'
            }
        },
        cssmin: {
            target: {
                files: {'dist/styles.min.css': ['dist/styles.css']}
            }
        },
        clean: {
            all: ['dist/*'],
            nonminified: ['dist/app.js', 'dist/styles.css']
        },
        processhtml: {
            dist: {
                options: {
                    process: true
                },

                files: [{
                    expand: true,
                    cwd: 'app/pages/',
                    src: ['*.html'],
                    dest: 'dist',
                    ext: '.html'
                }]
            }
        },
        docker_io: {
            testimage: {
                options: {
                    dockerFileLocation: '.',
                    buildName: 'dirlist-ui',
                    tag: 'latest',
                    pushLocation: 'https://docker.zbfl.tk',
                    username: 'zbfl-dckr-user',
                    push: true,
                    // force: true
                }
            }
        }
    });

    grunt.registerTask('default', [
        'clean:all',
        'concat_css',
        'cssmin',
        'copy',
        'concat',
        'uglify',
        'clean:nonminified',
        'processhtml'
    ]);
};