'use strict'

// Compiles Sass to CSS and generates necessary files if requested
module.exports = {
  options: {
    sassDir: '<%= gmSites.app %>/styles',
    cssDir: '.tmp/styles',
    generatedImagesDir: '.tmp/images/generated',
    imagesDir: '<%= gmSites.app %>/images',
    javascriptsDir: '<%= gmSites.app %>/**',
    fontsDir: '<%= gmSites.app %>/styles/fonts',
    importPath: './bower_components',
    httpImagesPath: '/images',
    httpGeneratedImagesPath: '/images/generated',
    httpFontsPath: '/styles/fonts',
    relativeAssets: false,
    assetCacheBuster: false,
    raw: 'Sass::Script::Number.precision = 10\n'
  },
  dist: {
    options: {
      generatedImagesDir: '<%= gmSites.dist %>/images/generated'
    }
  },
  server: {
    options: {
      debugInfo: true
    }
  }
}
