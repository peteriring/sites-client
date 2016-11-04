'use strict'

angular.module('GMClient')

  .filter('keyToText', function () {
    return function (input) {
      input = input || ' '
      var result = input.charAt(0).toUpperCase() + input.slice(1)
      return result
    }
  })
