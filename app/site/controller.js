'use strict'
/* global _ */

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider.state('app.me.site', {
      url: '/site',
      templateUrl: 'site/view.html',
      controller: 'SiteController',
      data: {
        title: 'My Site'
      }
    })
  })

  .controller('SiteController', function ($scope, ApiService, CurrencyService, MeCountryService, log, SiteConfig, TimeZones) {
    // ui values
    $scope.currencies = []
    $scope.engines = []
    $scope.states = []
    $scope.campaignItemLanguages = []
    $scope.timeZones = TimeZones.generate()

    // init functions
    log.text('site: init', log.level.INFO)

    ApiService

      .get('me')
      .then(function (result) {
        log.text('site: user loaded', log.level.DEBUG)

        var user = result.me
        var country = user.site.antiSpam.country

        $scope.user = user
        $scope.ghostFrequency = _.reduce(_.keys(user.site.ghostFrequencyLimit), function (memo, key) {
          return memo.value > user.site.ghostFrequencyLimit[key] ? memo : {
            value: user.site.ghostFrequencyLimit[key],
            interval: key
          }
        }, {value: 0, interval: 'minutes'})
        if (country) {
          return MeCountryService.states(country)
        }
      })
      .then(function (states) {
        log.text('settings: states loaded', log.level.DEBUG)

        $scope.states = states

        return ApiService.get('siteengines')
      })
      .then(function (result) {
        $scope.engines = _.map(result.siteengines, function (element) {
          return {
            display: element.name,
            value: element._id
          }
        })
        return ApiService.get('campaignitemlanguages')
      })
      .then(function (result) {
        $scope.campaignItemLanguages = _.map(result.campaignitemlanguages, function (element) {
          return {
            display: element.name,
            value: element._id
          }
        })
        return CurrencyService.ordered()
      })
      .then(function (result) {
        $scope.currencies = result
      })
      .catch(function () {
        log.ui('site: loading failure', log.level.ERROR)
      })

    $scope.$emit('me-title', 'My Site')

    // scope functions
    $scope.selectCountry = function (countryName) {
      $scope.user.site.antiSpam.state = ' '

      // TODO: only post if atomic
      // ApiService.put('me/update/site', {'account.state': ''})

      return MeCountryService

        .states(countryName)
        .then(function (states) {
          $scope.states = states
          return MeCountryService.countries()
        })
    }

    $scope.updateSite = function (site) {
      site.ghostFrequencyLimit = {
        days: 0,
        hours: 0,
        minutes: 0
      }
      $scope.ghostFrequency.value = Math.max($scope.ghostFrequency.value, 0)
      site.ghostFrequencyLimit[$scope.ghostFrequency.interval] = $scope.ghostFrequency.value

      return ApiService

        .put('me/update/site', site, ['me'])
        .then(function () {
          SiteConfig.currency = site.currency
          log.ui('site: saved', log.level.SUCCESS)
        })
        .catch(function () {
          log.ui('site: saving failed', log.level.ERROR)
        })
    }

    $scope.updateAntiSpam = function () {
      var user = $scope.user

      return ApiService

        .put('me/update/user', user, ['me', 'me/campaigns'])
        .then(function () {
          log.ui('site: anti-spam saved', log.level.SUCCESS)
        })
        .catch(function () {
          log.ui('site: anti-spam saving failed', log.level.ERROR)
        })
    }
  })
