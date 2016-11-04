'use strict'

// Copies remaining files to places other tasks can use
module.exports = function (grunt, gruntOptions) {
  var basePath = gruntOptions.gmSites.vendor

  var newrelicSrc = basePath + `/newrelic/${gruntOptions.gmConfig.mode}.js`
  var newrelic = { files: [{ src: newrelicSrc, dest: '<%= gmSites.app %>/newrelic.js' }] }

  var crazyeggSrc = basePath + `/crazyegg/${gruntOptions.gmConfig.mode}.js`
  var crazyegg = { files: [{ src: crazyeggSrc, dest: '<%= gmSites.app %>/crazyegg.js' }] }
  return {
    newrelic,
    crazyegg,
    dist: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%= gmSites.app %>',
        dest: '<%= gmSites.dist %>',
        src: [
          '*.{ico,png,txt}',
          '.htaccess',
          '*.html',
          // '**/{,*/}*.html',
          'images/{,*/}*.{webp,svg}',
          'fonts/*'
        ]
      }, {
        expand: true,
        cwd: '<%= gmSites.app %>',
        src: 'images/favicons/{,*/}*.{png,ico}',
        dest: '<%= gmSites.dist %>'
      }, {
        expand: true,
        cwd: '.tmp/images',
        dest: '<%= gmSites.dist %>/images',
        src: ['generated/*']
      }, {
        expand: true,
        cwd: 'bower_components/bootstrap-sass/assets/fonts/bootstrap/',
        src: '*.*',
        dest: '<%= gmSites.dist %>/fonts'
      }, {
        expand: true,
        cwd: 'bower_components/font-awesome/',
        src: 'fonts/*.*',
        dest: '<%= gmSites.dist %>'
      }, {
        expand: true,
        cwd: 'bower_components/bootstrap/dist/',
        src: 'fonts/*.*',
        dest: '<%= gmSites.dist %>'
      }, {
        expand: true,
        cwd: 'bower_components/sass.js/dist/',
        src: 'sass.worker.js',
        dest: '<%= gmSites.dist %>'
      }, {
        expand: true,
        cwd: '<%= gmSites.app %>',
        src: 'devDependencies.json',
        dest: '<%= gmSites.dist %>'
      }]
    },
    styles: {
      expand: true,
      cwd: '<%= gmSites.app %>/styles',
      dest: '.tmp/styles/',
      src: '{,*/}*.css'
    }
  }
}
