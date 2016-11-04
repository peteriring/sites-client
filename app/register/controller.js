'use strict'
angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider.state('auth.register', {
      url: '/register?site&domain',
      templateUrl: 'register/view.html',
      controller: 'RegisterController',
      data: {
        title: 'Register'
      }
    })
  })

  .controller('RegisterController', function ($scope, $state, $auth, $window, $stateParams, ApiService, log) {
    // ui values
    $scope.user = {
      email: '',
      password: '',
      domain: $stateParams.domain || ''
    }

    // init functions
    ApiService.stop()

    // scope functions
    $scope.register = function (user) {
      user.site = $stateParams.site

      return ApiService

        .post('auth/register', user)
        .then(function (result) {
          log.ui('register: success', log.level.SUCCESS)
          $state.go('wizard.token', { token: result.data.token })
        })
        .catch(function () {
          log.ui('register: failed', log.level.ERROR)
        })
    }

    $scope.back = function () {
      $window.history.back()
    }
  })
