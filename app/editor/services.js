'use strict'
/*global _*/

angular.module('GMClient')

  .factory('DelayedCallback', function ($timeout) {
    var timer = false
    var timeout = 100

    return function ($scope, callback) {
      if (timer && typeof timer.then === 'function') { $timeout.cancel(timer) }
      timer = $timeout(function () {
        callback.apply($scope, arguments)
        timer = false
      }, timeout)
    }
  })

  .factory('TemplateFactory', function () {
    var regex = /@@[a-zA-Z0-9-]+|<!-- inlinestyle -->/g

    return function (template) {
      var keys = template.match(regex) || []
      var variables = {}
      var fragments = template.split(regex)
      var result = {
        replace: function (key, value) {
          variables[key] = value
        },
        get: function () {
          var index = -1
          return _.reduce(fragments, function (memo, fragment) {
            index += 1
            return memo + fragment + (index < keys.length ? variables[keys[index]] : '')
          }, '')
        }
      }

      return result
    }
  })
