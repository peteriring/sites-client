'use strict'
/* global twttr */

/**
 * @ngdoc overview
 * @name gameApp
 * @description
 * # gameApp
 *
 * Main module of the application.
 */
angular.module('GMClient', [
  'config',
  'ngAnimate',
  'ngStorage',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',

  'ui.router',
  'ui.bootstrap',
  'ui.sortable',
  'ui.select',
  'satellizer',
  'ngTable',
  'NgSwitchery',
  'textAngular',
  'ngMask',
  'ui-notification',
  'daterangepicker',
  'ngIdle',
  'teljs',
  '$q-spread',
  'chart.js',
  'minicolors',
  'ui.slider',
  'GMClient.templates',
  'ngMockE2E',
  'monospaced.elastic'
])

  .config(function ($authProvider, ENV, $urlRouterProvider, IdleProvider, ApiServiceProvider) {
    $authProvider.httpInterceptor = true // Add Authorization header to HTTP request
    $authProvider.loginOnSignup = true
    $authProvider.loginRedirect = ''
    $authProvider.logoutRedirect = ''
    $authProvider.loginUrl = ENV.apiEndpoint + 'auth/process'
    $authProvider.signupUrl = ENV.apiEndpoint + 'auth/register'
    $authProvider.loginRoute = '/login'
    $authProvider.signupRoute = '/signup'
    $authProvider.tokenName = 'token'
    $authProvider.tokenPrefix = 'satellizer' // Local Storage name prefix
    $authProvider.unlinkUrl = '/auth/unlink/'
    $authProvider.authHeader = 'X-Auth-Token'

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function ($injector) {
      $injector.get('$state').go('app.dashboard')
    })

    IdleProvider.idle(3540)
    IdleProvider.timeout(60)

    ApiServiceProvider.delayAfterPromise = 5000
    ApiServiceProvider.delayAfterAuto = 2000
    ApiServiceProvider.cacheDisabled = false
    ApiServiceProvider.endPoints = [
      ['me', 0],
      ['me/campaigns', 300],
      ['plans', 0],
      ['countries', 0]
    ]
  })

  .value('SiteConfig', {
    currency: 'USD',
    dateFormat: 'MMM DD'
  })

  // global event listener
  .run(function ($rootScope, $state, $auth, $window, $location, Intercom, log, siteInfo) {
    $rootScope.state = $state // state to be accessed from view
    $rootScope.$on('$stateChangeStart', function (event, toState) {
      var name = toState.name
      if (!siteInfo.isNotShopify && toState.name === 'app.me.billing') return event.preventDefault()

      if (!$auth.isAuthenticated()) {
        if (name !== 'auth.login' && name.indexOf('wizard') === -1 && name !== 'auth.register' && name.indexOf('wait') === -1) {
          event.preventDefault()
          $state.go('auth.login')
        }
      } else if (twttr) {
        twttr.conversion.trackPid('nutn6', { tw_sale_amount: 0, tw_order_quantity: 0 })
      }

      if ($window.ga) {
        $window.ga('send', 'pageview', { page: $location.path() })
      }

      if (name !== 'auth.login' && name !== 'auth.register') { Intercom.update() }
    })

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      log.text(toState.name + ': init', log.level.INFO)
    })

    $rootScope.$on('$stateChangeError', function (event, toState) {
      log.ui(toState.name + ': failed', log.level.ERROR)
    // $state.go('app.dashboard')
    })
  })
