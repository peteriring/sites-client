'use strict'

module.exports = {
  bower: {
    files: ['bower.json'],
    tasks: ['wiredep']
  },
  js: {
    files: ['<%= gmSites.app %>/**/*.js'],
    tasks: ['newer:jshint:all'],
    options: {
      livereload: '<%= connect.options.livereload %>'
    }
  },
  jsTest: {
    files: ['<%= gmSites.test %>/spec/{,*/}*.js'],
    tasks: ['newer:jshint:test', 'karma']
  },
  // compass: {
  //   files: ['<%= gmSites.app %>/styles/{,*/}*.{scss,sass}'],
  //   tasks: ['compass:server', 'autoprefixer']
  // },
  sass: {
    files: ['<%= gmSites.app %>/styles/**/*.{scss,sass}'],
    tasks: ['sass:server', 'autoprefixer']
  },
  gruntfile: {
    files: ['Gruntfile.js']
  },
  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      '<%= gmSites.app %>/{,*/}*.html',
      '<%= gmSites.app %>/**/{,*/}*.html',
      '<%= gmSites.app %>/styles/{,*/}*.css',
      '.tmp/styles/{,*/}*.css',
      '<%= gmSites.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
    ],
    tasks: ['html2js:dev']
  }
}
