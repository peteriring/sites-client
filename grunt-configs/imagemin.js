'use strict'

module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= gmSites.app %>/images',
      src: '{,*/}*.{png,jpg,jpeg,gif}',
      dest: '<%= gmSites.dist %>/images'
    }]
  }
}
