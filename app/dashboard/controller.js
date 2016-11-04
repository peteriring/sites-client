'use strict'
/* global _, moment */

angular.module('GMClient')

  .config(function ($stateProvider, ChartJsProvider) {
    $stateProvider.state('app.dashboard', {
      url: '/dashboard',
      templateUrl: 'dashboard/view.html',
      controller: 'DashboardController',
      data: {
        title: 'Dashboard'
      },
      resolve: {
        ApiService: 'ApiService',
        data: function (ApiService) { return ApiService.nonblock.get(['me', 'me/campaigns', 'me/ghosts', 'me/statistics']) }
      }
    })

    ChartJsProvider.setOptions({
      colours: ['#30a2ef', '#30a2ef'],
      responsive: true
    })
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      datasetFill: true,
      datasetStrokeWidth: 4
    })
  })

  .controller('DashboardController', function ($scope, $q, log, ApiService, DatePickerConfig, SiteConfig) {
    // ui values
    $scope.recoveredRevenue = { labels: [], data: [] }
    $scope.sentEmails = { labels: [], data: [] }

    $scope.options = {
      scaleShowHorizontalLines: true,
      bezierCurve: false,
      pointDotRadius: 6,
      scaleShowLabels: true,
      scaleShowVerticalLines: true,
      responsive: true,
      tooltipFillColor: 'rgba(150, 150, 150, 1)'
    }

    // init functions
    ApiService.get('me')
      .then(function (result) {
        log.text('dashboard: user loaded', log.level.DEBUG)

        var user = result.me

        $scope.picker = new DatePickerConfig(user.site.createdAt)
        delete $scope.picker.options.dateLimit
        $scope.user = user
      })

    ApiService.get('me/campaigns')
      .then(function (result) {
        log.text('dashboard:  campaigns loaded', log.level.DEBUG)

        var campaigns = result.campaigns
        $scope.emails = _.chain(campaigns)

          .pluck('items')
          .flatten()
          .map(function (item) { return _.clone(item) })
          .filter(function (item) {
            return item.itemType !== 'sms'
          })
          .value()
      })
/*
    ApiService.get('me/ghosts')
      .then(function (result) {
        log.text('dashboard: sessions loaded', log.level.DEBUG)

        var ghosts = result.ghosts
        $scope.ghosts = ghosts.ghosts
      })

    ApiService.get('me/statistics')
      .then(function (result) {
        result = result.statistics
        var statistics = []
        result.campaigns.forEach(function (campaign) {
          statistics = statistics.concat(campaign.items)
        })

        $scope.emails = _.chain($scope.emails)
          .map(function (email) {
            var eStats = _.findWhere(statistics, {_id: email.id})
            email.statistics = eStats ? eStats.statistics : {}
            return email
          })
          .sortBy(function (email) {
            return -email.statistics.clickRate
          })
          .value()
      })
      .catch(function () {
        log.ui('dashboard: loading failure', log.level.ERROR)
      })
*/
    // scope functions
    $scope.selectRange = function () {
      var picker = $scope.picker
      var selected = picker.range
      var ranges = picker.options.ranges
      var rangeKeys = _.keys(ranges)
      var preKey

      _.each(rangeKeys, function (key) {
        var range = ranges[key]

        if (range[0].isSame(selected.startDate) && range[1].isSame(selected.endDate)) {
          preKey = key
        }
      })

      picker.display = preKey || selected.startDate.format(SiteConfig.dateFormat) + ' to ' + selected.endDate.format(SiteConfig.dateFormat)

      ApiService

        .get('me/statistics', {
          start: selected.startDate.toISOString(),
          end: selected.endDate.toISOString()
        })
        .then(function (result) {
          $scope.statistics = result.statistics.site.statistics
        })
        .catch(function () {
          log.ui('dashboard: statistics query failed', log.level.ERROR)
        })
        .finally(function () {
          $scope.statistics = $scope.statistics || {}
          _.defaults($scope.statistics, {
            sentEmails: 0,
            clickRate: 0,
            openRate: 0,
            bounceRate: 0,
            recoveredRevenue: 0,
            shopRevenueWithoutGM: 0,
            revenueGrowth: 0,
            shopRevenueWithGM: 0,
            checkoutsStarted: 0,
            abandonedCarts: 0,
            recoveredCarts: 0,
            cartAbandonmentRate: 0,
            conversionRate: 0,
            lostRevenue: 0,
            identifiableRate: 0,
            abandonedCartsWithEmail: 0,
            abandonmentRate: 0,
            startedCheckout: 0
          })
        })

      return ApiService

        .get('me/diagram', {
          start: selected.startDate.toISOString(),
          end: selected.endDate.toISOString(),
          type: 'sites',
          filters: ['recoveredRevenue', 'sentEmails']
        })
        .then(function (result) {
          var site = $scope.user.site
          var data = result.diagram.data[site._id]
          $scope.diagrams = _.object(_.map(data, function (arrays, key) {
            var object = { labels: [], data: [[]] }

            _.each(arrays, function (array) {
              object.labels.push(moment(array[0] * 1000).format(SiteConfig.dateFormat))
              object.data[0].push(array[1])
            })
            return [key, object]
          }))
        })
        .catch(function () {
          log.ui('dashboard: diagram query failed', log.level.ERROR)
        })
        .finally(function () {
          $scope.diagrams = $scope.diagrams || {}
          _.defaults($scope.diagrams, {
            recoveredRevenue: {
              data: [[0, 0]],
              labels: [moment().format(SiteConfig.dateFormat), moment().format(SiteConfig.dateFormat)]
            },
            sentEmails: {
              data: [[0, 0]],
              labels: [moment().format(SiteConfig.dateFormat), moment().format(SiteConfig.dateFormat)]
            }
          })
        })
    }
  })
