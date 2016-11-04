'use strict'

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider.state('app', {
      abstract: true,
      templateUrl: 'core/view.html',
      controller: 'CoreController',
      resolve: {
        ApiService: 'ApiService',
        data: function ($auth, $q, ApiService, IdleService, $state, SiteConfig) {
          return ApiService

            .get('me')
            .then(function (result) {
              var user = result.me
              SiteConfig.currency = user.site.currency

              if (!user.site.wizardFinished) {
                $state.go('wizard.token', { token: $auth.getToken() })
              }
              return $q.when(result)
            })
            .catch(function () {
              $state.go('auth.login')
            })
        }
      }
    })
  })

  .controller('CoreController', function ($scope, $auth, $state, $window, log, ApiService, IdleService, Intercom, siteInfo, data) {
    var user = data.me
    // ui values
    $scope.user = user
    $scope.siteInfo = siteInfo
    if ($scope.user.site.isBillingActive === 'active' &&
        $scope.user.site.billing.accountManagementUrl) {
      $scope.accountManagementUrl = $scope.user.site.billing.accountManagementUrl
    }
    // init functions
    ApiService.start()
    IdleService.start(user)

    // INTERCOMM INTEGRATION
    Intercom.push({
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      domain: user.site.domain
    })

    // scope functions
    $scope.isAuthenticated = function () {
      return $auth.isAuthenticated()
    }

    $scope.logout = function () {
      log.ui('logout: successful', log.level.SUCCESS)
      ApiService.stop()
      IdleService.stop()
      $auth.logout()
      Intercom.shutdown()
      $state.go('auth.login')
    }
  })
