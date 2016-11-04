'use strict'
/* global _, moment */

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider

      .state('app.me.plugins', {
        url: '/plugins',
        templateUrl: 'plugins/view.html',
        controller: 'PluginsController',
        resolve: {
          ApiService: 'ApiService',
          data: function (ApiService) { return ApiService.nonblock.get(['me', 'siteengines']) }
        },
        data: {
          title: 'Set up your plugins'
        }
      })
  })

  .controller('PluginsController', function ($scope, $state, $q, $modal, ENV, ApiService, siteInfo, log) {
    // ui values
    $scope.engines = []

    $scope.ui = {
      engine: '',
      url: '',
      siteUrl: '',
      shopifyMessage: 'Our Shopify App is under review in the Shopify App store. Please come back in a few days!'
    }

    $scope.$watch('ui.engine', function (engine) {
      var url = _.find($scope.engines, function (plugin) { return plugin.slug.toLowerCase() === engine.toLowerCase() })
      $scope.ui.url = url ? (engine === 'Opencart' ? (url.pluginUrl + '?' + moment().unix()) : url.pluginUrl) : ''
      $scope.ui.pluginPageUrl = url ? url.pluginPageUrl : ''
    })

    // init functions

    ApiService

      .get(['me', 'siteengines'])
      .then(function (result) {
        var user = result.me
        var protocolRegexp = /^(https?:\/\/)?(www)?\.?/g
        $scope.user = user
        $scope.engines = result.siteengines
        $scope.ui.engine = _.find($scope.engines, function (engine) { return engine.id === user.site.engine })
        $scope.ui.engine = $scope.ui.engine ? $scope.ui.engine.name.toLowerCase() : 'other'
        $scope.ui.siteUrl = user.site.domain.replace(protocolRegexp, '.')
        $scope.shopifyUrl = ENV.shopifyApi +
        'authUrl?shop=' + user.site.domain.replace(protocolRegexp, '') +
        '&gmSiteId=' + user.site.id
        var url = _.find($scope.engines, function (plugin) { plugin.slug.toLowerCase() === $scope.ui.engine.toLowerCase() })
        $scope.ui.url = url ? ($scope.ui.engine === 'Opencart' ? (url.pluginUrl + '?' + moment().unix()) : url.pluginUrl) : ''
      })

    // scope functions
    $scope.shopifyModal = function ($event) {
      $modal.open({
        templateUrl: 'wizard/templates/shopify-modal.html',
        size: 'lg',
        scope: $scope
      })
    }

    $scope.openModal = function () {
      $modal.open({
        templateUrl: 'plugins/templates/cantFindPluginModal.html',
        controller: 'CantFindPluginModalController'
      }).result.then(function (input) {
        $scope.ui.engine = input
        $scope.save()
      })
    }

    $scope.save = function () {
      var engine = $scope.ui.engine || 'other'

      return ApiService

        .post('me/plugin', { engine: engine }, ['me', 'me/campaigns'])
        .then(function () {
          return ApiService.get('me')
        })
        .then(function (result) {
          return result.me
        })
        .then(siteInfo.refresh)
        .then(function () {
          $state.go('app.dashboard')
          log.ui('plugin: saved', log.level.SUCCESS)
        })
        .catch(function () {
          log.ui('plugin: failed', log.level.ERROR)
        })
    }
  })
