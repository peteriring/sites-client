'use strict'

module.exports = function (grunt, gruntConfig) {
  return {
    // Options for all targets
    options: {
      space: '  ',
      wrap: '"use strict";\n\n {%= __ngModule %}',
      name: 'config'
    },
    dist: {
      options: {
        dest: '<%= gmSites.app %>/config.js'
      },
      constants: {
        ENV: {
          name: gruntConfig.gmConfig.mode,
          apiEndpoint: gruntConfig.gmConfig.apiEndpoint,
          intercomKey: gruntConfig.gmConfig.intercomKey,
          logentriesToken: gruntConfig.gmConfig.logentriesToken,
          landingEndpoint: gruntConfig.gmConfig.landingEndpoint,
          shopifyApi: gruntConfig.gmConfig.shopifyApi,
          cdnUrl: gruntConfig.gmConfig.cdnUrl,
          recurlyPublicKey: gruntConfig.gmConfig.recurlyPublicKey,
          ghostPageUrl: gruntConfig.gmConfig.ghostPageUrl
        }
      }
    }
  }
}
