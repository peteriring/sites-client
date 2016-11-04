'use strict'

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider

      .state('auth.login', {
        url: '/login/{token}',
        templateUrl: 'login/view.html',
        controller: 'LoginController',
        data: {
          title: 'Login'
        },
        resolve: {
          data: function ($stateParams, $state, $q, $auth, ApiService) {
            if ($stateParams && $stateParams.token) {
              $auth.setToken($stateParams.token, false)
              return ApiService

                .get('me')
                .then(function () {
                  $state.go('app.dashboard')
                  location.reload(true)
                })
                .catch(function () {
                  $state.go('auth.login')
                })
            }
          }
        }
      })
  })

  .controller('LoginController', function ($scope, $state, $auth, ApiService, log, ENV, $timeout, $window) {
    // ui values
    $scope.showPassword = 'password'
    $scope.user = {
      email: '',
      password: ''
    }

    $scope.landingEndpoint = ENV.landingEndpoint

    ApiService.stop()
    // scope functions
    $scope.login = function () {
      return $auth
        .login($scope.user)
        .then(function () {
          log.ui('login: success', log.level.SUCCESS)
          $state.go('app.dashboard')
        })
        .catch(function () {
          log.ui('login: failed', log.level.ERROR)
        })
    }
  })
