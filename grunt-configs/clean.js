'use strict'

module.exports = {
  dist: {
    files: [{
      dot: true,
      src: [
        '.tmp',
        '<%= gmSites.dist %>/{,*/}*',
        '!<%= gmSites.dist %>/.git*'
      ]
    }]
  },
  server: '.tmp'
}
