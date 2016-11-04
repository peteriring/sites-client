'use strict'
/* global localStorage, _, nunjucks */

angular.module('GMClient')

  .controller('CampaignItemEditorController', function ($scope, $compile, $element, $q, $timeout, ApiService, TemplateFactory, DelayedCallback, $templateRequest, $http, log, $state, $stateParams, data) {
    // scope variables
    var path = _.find(_.keys(data), function (key) { return key.indexOf('schema') > -1 })
    var campaignId = $stateParams.campaignId
    var currency = _.find(data.currencies, function (currency) { return currency.id === $scope.user.site.currency }) || {}
    $scope.itemId = $stateParams.itemId
    $scope.campaign = _.find(data.campaigns, function (campaign) { return campaign._id === campaignId })
    $scope.schedule = data[path].schema.schedule
    $scope.interval = _.find(_.keys($scope.schedule), function (key) { return $scope.schedule[key] > 0 }) || 'minutes'
    $scope.symbol = currency.symbol
    $scope.scheduleVariables = {
      value: $scope.schedule[$scope.interval],
      error: false
    }

    // scope functions
    $scope.preset = function (headerBg, headerTxt, titleTxt, title2Txt, title2Bg, buttonTxt, button, link) {
      $scope.schema.design['color-header-bg'].value = headerBg
      $scope.schema.design['color-header-txt'].value = headerTxt
      $scope.schema.design['color-h1-txt'].value = titleTxt
      $scope.schema.design['color-h2-txt'].value = title2Txt
      $scope.schema.design['color-h2-bg'].value = title2Bg
      $scope.schema.design['color-button-txt'].value = buttonTxt
      $scope.schema.design['color-button-bg'].value = button
      $scope.schema.design['color-link-txt'].value = link

      $scope.assemble()
    }

    $scope.setInterval = function (interval) { $scope.interval = interval }

    // init functions
    $scope.setUp(
      data[path].template,
      data[path].style,
      data[path].schema,
      {
        templateVariances: function (raw) {
          var total = '100'
          var price = '10'
          var qtyPrice = '10'
          if ($scope.symbol && $scope.schema.variables.displayCurrency.value) {
            var template = _.template(currency.template)
            total = template({symbol: $scope.symbol, amount: '100'})
            price = template({symbol: $scope.symbol, amount: '10'})
            qtyPrice = template({symbol: $scope.symbol, amount: '10'})
          }

          var items = [{
            name: 'Test product 1',
            productId: 1,
            price: price,
            productUrl: 'http://test.com',
            category: '',
            qty: 1,
            qtyPrice: qtyPrice,
            imageUrl: 'http://cutepuppyclub.com/wp-content/uploads/2015/05/White-Cute-Puppy-.jpg'
          }]
          raw.template.replace('@@logo', $scope.schema.image.logo.value)
          return nunjucks.renderString(raw.template.get(), { cart: { 'items': items, data: { value: total } } })
        },
        resetVariances: function (schema) {
          return ApiService.put('me/editor/schema', {item: $scope.itemId, model: 'CampaignItem'})
        },
        saveVariances: function (changes) {
          var schedule = {minutes: 0, hours: 0, days: 0}
          schedule[$scope.interval] = $scope.scheduleVariables.value
          $scope.schedule = schedule
          if ((schedule.minutes || 0) + 60 * (schedule.hours || 0) < 10) {
            return $q(function (resolve, reject) {
              log.ui('minimal delivery time is 10 minutes', log.level.ERROR)
              $scope.scheduleVariables.error = true
              $timeout(function () {
                $scope.scheduleVariables.error = false
              }, 10000)
              if (!$scope.$$phase) { $scope.$apply() }
              reject({message: 'failure'})
            })
          }
          return ApiService.put('me/editor/schema', {
            schema: changes,
            item: $scope.itemId,
            schedule: schedule,
            model: 'CampaignItem'
          },
          ['me/editor/' + path, 'me/campaigns'])
        }
      })

    _.map($scope.schema.image, function (content, name) {
      if (name === '_id' || name === 'id') return content
      content.value = content.value || localStorage.getItem(name) || content.default
      return content
    })
  })
