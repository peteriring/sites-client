'use strict'

// Automatically inject Bower components into the app
module.exports = {
  app: {
    src: ['<%= gmSites.app %>/index.html'],
    ignorePath: /\.\.\//,
    exclude: ['bower_components/bootstrap/dist/css/bootstrap.css']
  },
  sass: {
    src: ['<%= gmSites.app %>/styles/{,*/}*.{scss,sass}'],
    ignorePath: /(\.\.\/){1,2}bower_components\//
  }
}
