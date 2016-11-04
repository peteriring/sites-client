'use strict'

// Performs rewrites based on filerev and the useminPrepare configuration
module.exports = {
  html: ['<%= gmSites.dist %>/{,*/}*.html'],
  css: ['<%= gmSites.dist %>/styles/{,*/}*.css'],
  options: {
    assetsDirs: ['<%= gmSites.dist %>', '<%= gmSites.dist %>/images']
  }
}
