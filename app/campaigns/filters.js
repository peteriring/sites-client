'use strict'
/* global nunjucks */

angular.module('GMClient')

  .filter('campaignsMock', function ($sce) {
    return function (input, site) {
      input = input || ''
      input = nunjucks.renderString(input, site)
      return $sce.trustAsHtml(input)
    }
  })
