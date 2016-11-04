'use strict'
/* global _ */

angular.module('GMClient')

  .filter('percent', function () {
    return function (input) {
      input = parseFloat(input) || 0

      input = (input * 100).toFixed(2)
      return Math.max(input, 0) + '%'
    }
  })

  .filter('cut', function () {
    return function (value, wordwise, max, tail) {
      if (!value) {
        return ''
      }

      max = parseInt(max, 10)
      if (!max) {
        return value
      }
      value = value.toString()
      if (value.length <= max) {
        return value
      }

      value = value.substr(0, max)
      if (wordwise) {
        var lastspace = value.lastIndexOf(' ')
        if (lastspace !== -1) {
          value = value.substr(0, lastspace)
        }
      }

      return value + (tail || '…')
    }
  })

  .filter('gmCurrency', function ($filter, SiteConfig, CurrencyService) {
    var currencies = {}
    CurrencyService.generate().then(function (result) {
      currencies = _.chain(result).map(function (elem) { return [elem.id, elem] }).object().value()
    })

    return function (amount) {
      var currency = _.defaults(currencies[SiteConfig.currency] || {}, {
        symbol: '',
        template: '<%= symbol %> <%= amount %>'
      })

      amount = $filter('currency')(amount, currency.symbol, 0)
      return amount
    }
  })

  .filter('sessionType', function () {
    return function (input) {
      var result = (input === 'customer_ghost' ? 'customer ghost' : input)
      return result
    }
  })
