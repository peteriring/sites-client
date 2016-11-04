'use strict'

module.exports = {
  options: {
    base: '<%= gmSites.app %>',
    module: 'GMClient.templates',
    singleModule: true,
    useStrict: true,
    htmlmin: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }
  },
  main: {
    src: ['<%= gmSites.app %>/**/{,*/}*.html'],
    dest: '<%= gmSites.app %>/templates.js'
  },
  dev: {
    src: [],
    dest: '<%= gmSites.app %>/templates.js'
  }
}
