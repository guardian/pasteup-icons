module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-hologram');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-scss-lint');

    grunt.task.renameTask('release', 'git-release');

    grunt.initConfig({
        clean: {
            build: [
                'build'
            ],
            docs: [
                'docs'
            ],
        },
        scsslint: {
            icons: [
                'src'
            ],
            options: {
                bundleExec: true,
                config: 'scss-lint.yml',
                reporterOutput: null
            }
        },
        sass: {
            icons: {
                options: {
                    style: 'compressed',
                    bundleExec: true
                },
                files:  [{
                    expand: true,
                    cwd: 'src',
                    src: [
                        '**/*.scss',
                        '!**/_*.scss'
                    ],
                    dest: 'build',
                    ext: '.min.css'
                }]
            }
        },
        hologram: {
            icons: {
                options: {
                    config: 'hologram-config.yml'
                }
            }
        },
        'gh-pages': {
            docs: {
                options: {
                    base: 'docs',
                    message: 'Releasing docs to http://guardian.github.io/pasteup-icons/'
                },
                src: [
                    '*.html',
                    'build/**/*',
                    'theme-build/**/*'
                ]
            }
        },
        'git-release': {
            options: {
                file: 'bower.json',
                npm: false
            }
        }
    });

    grunt.registerTask('validate', ['scsslint:icons']);
    grunt.registerTask('build', ['validate', 'clean:build', 'sass:icons']);
    grunt.registerTask('docs', ['build', 'clean:docs', 'hologram:icons']);
    grunt.registerTask('release', function (type) {
        var releaseTarget = type ? ':' + type : '';
        grunt.task.run(['build', 'git-release' + releaseTarget, 'clean:docs', 'hologram:icons', 'gh-pages:docs']);
    });
};
