'use strict'

var config = require('./config')()
var version = {
  long: require('./version').getVersion(),
  short: require('./version').getShortVersion()
}
var appConfig = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist',
  test: 'test/unit',
  protractor: 'test/e2e',
  vendor: 'grunt-vendor-templates'
}

var options = {
  gmSites: appConfig,
  version,
  devEndpoint: process.env.SITES_URL,
  livereloadPort: 35729,
  pkg: require('./package.json'),
  gmConfig: config,
  config: {
    src: 'grunt-configs/*.js'
  }
}

console.log(config)

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt)

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt)

  // Define the configuration for all the tasks
  var gruntConfigs = require('load-grunt-configs')(grunt, options)
  console.log(gruntConfigs.ngAnnotate)
  grunt.initConfig(gruntConfigs)
  grunt.registerTask('create-json', function () {
    if (config.mode === 'development') {
      require('./json-creators/createJson')(grunt)
    }
  })
  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive'])
    }

    grunt.task.run([
      'create-json',
      'clean:server',
      'ngconstant',
      'copy:newrelic',
      'copy:crazyegg',
      'html2js:dev',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ])
  })

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.')
    grunt.task.run(['serve:' + target])
  })

  grunt.registerTask('test', [
    'clean:server',
    'ngconstant',
    'html2js:main',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  //  'protractor:e2e'
  ])

  grunt.registerTask('build', [
    'clean:dist',
    'ngconstant',
    'copy:newrelic',
    'copy:crazyegg',
    'html2js:main',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'replace'
  ])

/*
grunt.registerTask('build-production', [
  'clean:dist',
  'ngconstant:production',
  'copy:newrelic-production',
  'copy:crazyegg-production',
  'html2js:main',
  'wiredep',
  'useminPrepare',
  'concurrent:dist',
  'autoprefixer',
  'concat',
  'ngAnnotate',
  'copy:dist',
  'cdnify',
  'cssmin',
  'uglify',
  'filerev',
  'usemin',
  'htmlmin',
  'replace'
]);*/
}
