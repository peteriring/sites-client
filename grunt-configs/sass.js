'use strict'

// Compiles Sass to CSS and generates necessary files if requested
module.exports = {
  server: {
    options: {
      sourceMap: false,
      sourceComments: true
    },
    files: {
      '.tmp/styles/style.css': '<%= gmSites.app %>/styles/style.scss'
    }
  },
  dist: {
    options: {
      sourceMap: false,
      outputStyle: 'compressed',
      sourceComments: true
    },
    files: {
      '.tmp/styles/style.css': '<%= gmSites.app %>/styles/style.scss'
    }
  }
}
