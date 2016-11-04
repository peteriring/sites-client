'use strict'

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider.state('auth', {
      abstract: true,
      templateUrl: 'auth/view.html',
      controller: 'AuthController'
    })
  })
  .controller('AuthController', function ($scope, ENV) {
    $scope.landingEndpoint = ENV.landingEndpoint + 'about/'
  })
