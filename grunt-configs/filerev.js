'use strict'

// Renames files for browser caching purposes
module.exports = function (grunt, gruntOptions) {
  return {
    options: {
      process: function (basename, name, extension) {
        if (basename === 'sass.worker') { return 'sass.worker.js' }
        return basename + '.' + gruntOptions.version.short + '.' + extension
      }
    },
    dist: {
      src: [
        '<%= gmSites.dist %>/**/*.js',
        '<%= gmSites.dist %>/styles/{,*/}*.css',
        // '<%= gmSites.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
        '<%= gmSites.dist %>/styles/fonts/*'
      ]
    }
  }
}
