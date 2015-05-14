module.exports = function(grunt){
    //Enable plug-ins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-coffee');

    //Build targets

    //Default target
    grunt.registerTask('default', ['build']);

    //Package Documentation
    grunt.registerTask('doc', [ 'shell:buildDocs']);

    //Build
    grunt.registerTask('build', ['clean', 'coffee:compile', 'doc' ]);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        coffee: {
            options: {
                bare: true
            },
            compile: {
                files: {
                    'inst/htmlwidgets/lib/panels/scatterplot/scatterplot.js': 'inst/htmlwidgets/lib/panels/scatterplot/scatterplot.coffee',
                    'inst/htmlwidgets/lib/panels/panelutil.js': 'inst/htmlwidgets/lib/panels/panelutil.coffee',
                    'inst/htmlwidgets/iplot.js' : 'inst/htmlwidgets/iplot.coffee'
                }
            }
        },

        shell: {
            options: {
                stderr: true
            },
            buildDocs: {
                command: "R -e 'library(devtools);document()'"
            }
        },

        clean: {
            options:{
                force : true
            },
            js: ['inst/htmlwidgets/iplot.js', 'inst/htmlwidgets/lib/panels/*.js', 'inst/htmlwidgets/lib/panels/scatterplot/*.js']
        },

        watch: {
          scripts: {
            files: [
              'inst/htmlwidgets/lib/panels/scatterplot/scatterplot.coffee',
              'inst/htmlwidgets/lib/panels/panelutil.coffee',
              'inst/htmlwidgets/iplot.coffee'
            ],
            tasks: ['build'],
            options: { nospawn: true }
          }
        }


    });

};
