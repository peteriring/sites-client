'use strict'
/* global _ */

angular.module('GMClient')
  .controller('AnalyticsController', function ($scope, $q, ApiService, log, DatePickerConfig) {
    // ui values
    $scope.picker = new DatePickerConfig()

    // init functions
    ApiService

      .get(['me', 'me/campaigns', 'me/ghosts'])
      .then(function (result) {
        log.text('analytics: user, sessions, campaigns loaded', log.level.DEBUG)

        var campaigns = result.campaigns
        var ghosts = result.ghosts
        var user = result.me
        $scope.user = user
        $scope.campaigns = campaigns
        $scope.siteStatistics = user.site.statistics
        $scope.ghosts = ghosts.ghosts

        var allCampaigns = {
          name: 'All Campaigns',
          statistics: $scope.siteStatistics,
          items: []
        }
        _.each(campaigns, function (campaign) {
          _.each(campaign.items, function (item) {
            if (allCampaigns.items.indexOf(item) === -1) {
              allCampaigns.items.push(item)
            }
          })
        })

        $scope.campaigns.unshift(allCampaigns)
        $scope.selectCampaign(allCampaigns)
        $scope.selectCampaignItem($scope.campaignItems[$scope.campaignItems.length - 1])
      })
      .catch(function () {
        log.ui('analytics: loading failure', log.level.ERROR)
      })

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

      var start = selected.startDate
      var end = selected.endDate
      picker.display = preKey || start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD')

      return ApiService

        .get('me/statistics', {
          start: start.toDate(),
          end: end.toDate()
        })
        .then(function (result) {
          $scope.siteStatistics = result.statistics || {}
          log.text(picker.display, log.level.DEBUG)
        })
        .catch(function () {
          log.ui('dashboard: statistics query failed', log.level.ERROR)
        })
    }

    $scope.selectCampaign = function (campaign) {
      $scope.selectedCampaign = campaign
      $scope.filteredStatistics = campaign.statistics || {}

      var campaignItems = []
      _.each(campaign.items, function (campaignItem) {
        if (campaignItem.itemType === 'email') {
          campaignItems.push(campaignItem)
        }
      })
      var allEmails = {
        subject: 'All Emails',
        statistics: campaign.statistics
      }
      campaignItems.unshift(allEmails)

      $scope.campaignItems = campaignItems
    }

    $scope.selectCampaignItem = function (campaignItem) {
      $scope.selectedCampaignItem = campaignItem
      $scope.filteredStatistics = campaignItem.statistics || {}
    }
  })
