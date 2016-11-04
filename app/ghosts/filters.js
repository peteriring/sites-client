'use strict'
/* global moment, _ */

angular.module('GMClient')

  .filter('ghostDatestring', function () {
    return function (input) {
      return moment(input, moment.ISO_8601).fromNow()
    }
  })

  .filter('ghostsDuration', function () {
    return function (input) {
      if (input >= 604800000) {
        return 'more than a week'
      }
      var sec = input / 1000
      var init = 1
      var formats = [['s', 60], ['m', 60], ['h', 24], ['d', 7]]

      var result = _.reduce(formats, function (memo, format) {
        var tag = format[0]
        var value = format[1]

        if (init <= sec) {
          var temp = (sec % (init * value))
          memo = Math.floor(temp / init) + tag + memo
        }
        init *= value

        return memo
      }, '')

      return result || ''
    }
  })
