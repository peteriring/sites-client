'use strict'

module.exports = {
  dist: {
    options: {
      variables: {
        'version': '<%=version.long%>'
      },
      force: true
    },
    files: [{
      expand: true,
      cwd: '<%= gmSites.dist %>',
      dest: '<%= gmSites.dist %>',
      src: [
        '*.js',
        '*.htm',
        '*.html'
      ]
    }]
  }
}
