'use strict'

const _ = require('underscore')
var port = process.env.PORT || 1339
var baseUrl = process.env.BASE_URL || process.env.SITES_URL || process.env.API_ENDPOINT || false

if (typeof baseUrl === 'string' && baseUrl.slice(-1) !== '/') {
  baseUrl += '/'
}

var def = {
  port: port,
  livereloadPort: process.env.LIVERELOAD_PORT || process.env.CDN_RELOAD_PORT || 35729,
  isLogOn: 'true',
  ghostPageUrl: process.env.GHOST_PAGE_URL
}

var config = {
  dev: {
    mode: 'development',
    log: process.env.NODE_LOG || 'debug',
    logentriesToken: '41245051-43a1-4168-bdfb-f18ae3b7fc6c',
    apiEndpoint: baseUrl,
    shopifyApi: process.env.SHOPIFY_API || 'https://shopify.ghostmonitor.info/',
    landingEndpoint: process.env.LANDING_URL || 'https://ghostmonitor.com/',
    cdnUrl: process.env.CDN_URL || 'https://gm-tracking-staging.s3.amazonaws.com/',
    intercomKey: 'gy1teoag',
    recurlyPublicKey: process.env.RECURLY_PUBLIC_KEY || '',
    ghostPageUrl: process.env.GHOST_PAGE_URL || 'http://localhost:3000/'
  },
  staging: {
    mode: 'staging',
    logentriesToken: '41245051-43a1-4168-bdfb-f18ae3b7fc6c',
    apiEndpoint: baseUrl || 'https://sites.ghostmonitor.info/',
    shopifyApi: process.env.SHOPIFY_API || 'https://shopify.ghostmonitor.info/',
    landingEndpoint: process.env.LANDING_URL || 'https://ghostmonitor.com/',
    cdnUrl: process.env.CDN_URL || 'https://gm-tracking-staging.s3.amazonaws.com/',
    intercomKey: 'gy1teoag',
    recurlyPublicKey: process.env.RECURLY_PUBLIC_KEY || 'ewr1-9zmT2YI4L9FMuBPTWBpYRp'
  },
  production: {
    mode: 'production',
    logentriesToken: 'b110533e-e1c0-4110-a6d4-1c9b48036958',
    apiEndpoint: baseUrl || 'https://sites.ghostmonitor.com/',
    shopifyApi: process.env.SHOPIFY_API || 'https://shopify.ghostmonitor.com/',
    landingEndpoint: process.env.LANDING_URL || 'https://ghostmonitor.com/',
    cdnUrl: process.env.CDN_URL || 'https://cdn.ghostmonitor.com/',
    intercomKey: 'n34rnc1g',
    recurlyPublicKey: process.env.RECURLY_PUBLIC_KEY || 'sjc-zPtNoZt81HbFI4u3htTPyn'
  }
}

module.exports = function (mode) {
  mode = process.env.NODE_ENV || mode || 'dev'
  return _.extend(def, config[mode])
}
