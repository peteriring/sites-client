'use strict'

module.exports = {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-stylish')
  },
  all: {
    src: [
      'Gruntfile.js',
      '<%= gmSites.app %>/**/*.js'
    ]
  },
  test: {
    options: {
      'jshintrc': '<%= gmSites.test %>/.jshintrc'
    },
    src: [
      '<%= gmSites.test %>/spec/{,*/}*.js'
    ]
  }
}
