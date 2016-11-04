'use strict'

module.exports = {
  dist: {
    options: {
      collapseWhitespace: true,
      conservativeCollapse: true,
      collapseBooleanAttributes: true,
      removeCommentsFromCDATA: true,
      removeOptionalTags: true
    },
    files: [{
      expand: true,
      cwd: '<%= gmSites.dist %>',
      src: ['*.html', '<%= gmSites.app %>/**/{,*/}*.html'],
      dest: '<%= gmSites.dist %>'
    }]
  }
}
