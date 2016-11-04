'use strict'

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider.state('app.me', {
      abstract: true,
      url: '/me',
      templateUrl: 'me/view.html',
      controller: 'MeController',
      resolve: {
        'ApiService': 'ApiService',
        data: function (ApiService) { return ApiService.nonblock.get('me') }
      }
    })
  })

  .controller('MeController', function ($scope, MeCountryService) {
    // ui values
    $scope.industries = ['Advertising', 'Computer', 'Electronics', 'Real Estate', 'Software', 'Telecommunications']
    if ($scope.user.site.isBillingActive === 'active' &&
        $scope.user.site.billing.accountManagementUrl) {
      $scope.accountManagementUrl = $scope.user.site.billing.accountManagementUrl
    }
    // init functions

    // scope funtions
    $scope.checkCountries = function () {
      return MeCountryService.countries()
    }
  })
