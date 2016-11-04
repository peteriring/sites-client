'use strict'

// Run some tasks in parallel to speed up the build process
module.exports = {
  server: [
    // 'compass:server'
    'sass::server'
  ],
  test: [
    'sass::server'
  ],
  dist: [
    'sass:dist',
    'imagemin'
  ]
}
