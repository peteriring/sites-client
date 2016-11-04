'use strict'

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider.state('wait', {
      url: '/wait',
      controller: 'WaitController',
      templateUrl: 'wait/view.html'
    })
      .state('wait.process', {
        url: '/process',
        templateUrl: 'wait/templates/process.html',
        data: {
          title: 'Please wait a second'
        }
      })
      .state('wait.resetpassword', {
        url: '/resetpassword',
        templateUrl: 'wait/templates/resetpassword.html',
        data: {
          title: 'Forgot your password'
        }
      })
  })

  .controller('WaitController', function ($scope, log, $state, $timeout, ApiService) {
    // ui values
    $scope.user = {}
    // init functions

    // scope funtions
    $scope.reset = function () {
      ApiService

        .post('validate/resetpassword', $scope.user)
        .then(function () {
          log.ui('Email sent', log.level.SUCCESS)
          $state.go('auth.login')
        })
        .catch(function () {
          log.ui('Failed to send email', log.level.ERROR)
        })
    }
  })
