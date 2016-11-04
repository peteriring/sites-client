'use strict'

angular.module('GMClient')

  .filter('knob', function () {
    return function (value) {
      value = parseInt((value || 0) * 100, 10)
      return Math.min(Math.max(value, 0), 100)
    }
  })
