'use strict'
/* global _, Sass */

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider

      .state('app.email_acquisition', {
        url: '/email-acquisition',
        templateUrl: 'email-acquisition/view.html',
        controller: 'EmailAcquisitionController',
        abstract: false,
        data: {
          title: 'Email acquisition'
        },
        resolve: {
          data: function (ApiService, $q, $stateParams) {
            return ApiService.get(['me/editor/schema?slug=atc-popup&model=Tue'])
          }
        }
      })
  })
  .controller('EmailAcquisitionController', function ($scope, $compile, $element, ApiService, TemplateFactory, log, data) {
    var regexp = /(.*slug=)([^?&=]*)(.*)/
    var sass = new Sass()
    $scope.tues = {}
    $scope.boxes = [{
      'title': 'Pre-Submit Tracking',
      'desc': 'If someone gives an email address on checkout page,we capture it and use the contact data for your cart recovery email campaign.',
      'count-desc': 'Collected Emails',
      'stat': 'pre_submit'
    },
    {
      'title': 'Login data Tracking',
      'desc': 'If someone is logged in, we capture the contact data with our  Login Data Tracking Technology. We use the contact data to send the cart recovery campaign.',
      'count': 610,
      'count-desc': 'Collected Emails',
      'stat': 'login'
    }/*,
    {
      'title': 'Subscriber Tracking',
      'desc': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.',
      'count': 146,
      'count-desc': 'Collected Emails'
    }*/
    ]
    _.each(data, function (value, key) {
      var matches = key.match(regexp)
      var slug = matches.length > 1 ? matches[2] : ''
      if (slug) $scope.tues[slug] = value
    })
    var schema = $scope.tues['atc-popup']
    var raw = {}
    raw.template = TemplateFactory(schema.template)
    raw.style = TemplateFactory(schema.editorStyle)
    $scope.schema = schema.schema
    $scope.compiled = ''

    $scope.assemble = function () {
      if (!raw.style || !raw.template || !$scope.schema) {
        return
      }
      var style = schema.style
      _.each($scope.schema.design, function (object, name) {
        raw.style.replace('@@' + name, object.value)
        style = style.replace('@@' + name, object.value)
      })

      style += '\n' + raw.style.get()
      sass.compile(style, function (style) {
        if (!style.text) {
          return log.text(JSON.stringify(style), log.level.ERROR)
        }
        raw.template.replace('<!-- inlinestyle -->', '<style type="text/css">' + style.text + '</style>')
        $scope.compiled = raw.template.get()
        if (!$scope.$$phase) { $scope.$apply() }
        _.each($scope.schema.text, function (obj, key) {
          $scope.compiled = $scope.compiled.replace('{{' + key + '}}', obj.value)
        })
        if (!$scope.schema.variables.closeable.value) $scope.compiled = $scope.compiled.replace(/\n.*"schema.variables.closeable.value".*\n/g, '')
        var iframe = $element.find('iframe')
        iframe.attr('srcdoc', $scope.compiled).load(function () {
          iframe.contents().find('form').submit(function (event) {
            event.preventDefault()
            return false
          })
        })
      })
    }

    $scope.assemble()

    ApiService.get('me')
      .then(function (result) {
        $scope.user = result.me
        return ApiService.get('emailAcquireTypes', {start: new Date(0), end: new Date(), site: $scope.user.site.id})
      })
      .then(function (result) {
        $scope.emailAcquireTypes = result.emailAcquireTypes
      })
    $scope.togglePopup = function (slug) {
      var popup = $scope.tues[slug]
      ApiService.put('me/switch/item', {'id': popup.id, 'enabled': !popup.isEnabled, model: 'Tue'}, 'me/campaigns')
        .then(function () {
          log.ui('changes saved', log.level.SUCCESS)
        })
        .catch(function () {
          log.ui('changes saving failed', log.level.ERROR)
        })
    }
  })
