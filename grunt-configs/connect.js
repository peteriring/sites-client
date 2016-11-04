'use strict'

module.exports = function (grunt, gruntOptions) {
  return {
    options: {
      port: process.env.SITES_CLIENT_PORT || process.env.CONNECT_PORT || 2337,
      hostname: '0.0.0.0',
      livereload: parseInt(process.env.LIVERELOAD_PORT, 10) || parseInt(process.env.SITES_CLIENT_RELOAD_PORT, 10) || 35729,
      ws: true
    },
    livereload: {
      options: {
        open: true,
        middleware: function (connect) {
          return [
            connect.static('.tmp'),
            connect().use(
              '/bower_components',
              connect.static('./bower_components')
            ),
            connect.static(gruntOptions.gmSites.app)
          ]
        }
      }
    },
    test: {
      options: {
        port: 9001,
        middleware: function (connect) {
          return [
            connect.static('.tmp'),
            connect.static(gruntOptions.gmSites.test),
            connect().use(
              '/bower_components',
              connect.static('./bower_components')
            ),
            connect.static(gruntOptions.gmSites.app)
          ]
        }
      }
    },
    dist: {
      options: {
        open: true,
        base: '<%= gmSites.dist %>'
      }
    }
  }
}
