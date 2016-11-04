'use strict'
/* global _, moment, Intl */

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider

      .state('wizard', {
        url: '/wizard',
        templateUrl: 'wizard/root.html',
        abstract: true
      })

      .state('wizard.token', {
        url: '/token/:token',
        resolve: {
          ApiService: 'ApiService',
          checkToken: function (ApiService, $q, $state, $auth, $stateParams) {
            if (!$stateParams || !$stateParams.token) {
              return $q.reject('missing token')
            }
            var existingToken = $auth.getToken()
            $auth.setToken($stateParams.token, false)

            return ApiService.get('me')
              .then(function (result) {
                var user = result.me
                var promise = $q.when(user)

                if (!user.site.wizardFinished) {
                  $state.go('wizard.process.yourstore', { fragment: $stateParams.token.split('.').pop() })
                  return promise
                }

                if (existingToken) {
                  $auth.setToken(existingToken)
                } else {
                  $auth.removeToken()
                }
                return $q.reject('user already finished wizard!')
              })
          }
        }
      })

      .state('wizard.process', {
        url: '/process/:fragment',
        controller: 'WizardController',
        templateUrl: 'wizard/view.html',
        abstract: true,
        resolve: {
          ApiService: 'ApiService',
          user: function (ApiService, $q, $auth, $stateParams) {
            var fragment = $stateParams.fragment
            var token = $auth.getToken()

            if (!token) {
              return $q.reject('nincs token')
            }

            if (token.indexOf(fragment) === -1) {
              return $q.reject('hamis token töredék')
            }

            return ApiService.get('me')
              .then(function (result) {
                var user = result.me
                if (user.site.wizardFinished) {
                  return $q.reject('hamis token')
                }
                return $q.when(user)
              })
          }
        }
      })

      .state('wizard.process.yourstore', {
        url: '/choose-your-webshop',
        templateUrl: 'wizard/templates/yourStoreForm.html',
        data: {
          title: 'Install GhostMonitor'
        }
      })

      .state('wizard.process.yourself', {
        url: '/tell-us-about-your-shop',
        templateUrl: 'wizard/templates/yourselfForm.html',
        data: {
          title: 'Tell us about your shop'
        }
      })

      .state('wizard.process.account', {
        url: '/setup-your-emails',
        templateUrl: 'wizard/templates/setupAccountForm.html',
        data: {
          title: 'Setup your emails'
        }
      })
  })

  .controller('WizardController', function ($scope, $state, $stateParams, $q, $modal, $timeout, $window, $element, CurrencyService, ApiService, MeCountryService, TimeZones, ENV, Intercom, LeadDyno, log, user) {
    $scope.countries = []
    $scope.currencies = [] // CurrencyService.generate()
    $scope.timeZones = TimeZones.generate()
    $scope.discounts = _.map(_.range(0, 0.3, 0.05), function (ratio) {
      return {
        display: ratio ? parseInt(ratio * 100, 10) + '%' : "I can't give any discount",
        value: ratio
      }
    })
    $scope.shopifyUrl = ENV.shopifyApi +
    'authUrl?shop=' + user.site.domain.replace(/^(https?:\/\/)?(www)?\.?/g, '') +
    '&gmSiteId=' + user.site.id
    $scope.plans = []
    $scope.campaignItemLanguages = []
    $scope.user = user

    if (user.site.engine) {
      $state.go('wizard.process.yourself')
    } else {
      delete $scope.user.site.name
      $scope.user.site.engine = 'woocommerce'
      $state.go('wizard.process.yourstore')
    }

    var stateQueue = [
      {
        name: 'wizard.process.yourstore',
        valid: false,
        started: moment()
      },
      {
        name: 'wizard.process.yourself',
        valid: false,
        started: null
      },
      {
        name: 'wizard.process.account',
        valid: false,
        started: null
      }
    ]
    $scope.user.site.discount = {
      amount: 0,
      enabled: false
    }
    // INTERCOMM INTEGRATION
    Intercom.send('signup_started', {
      site_id: user.site.id,
      email: user.email,
      domain: user.site.domain,
      signup_started: moment().toISOString()
    })

    // init functions
    ApiService.get('plans')
      .then(function (result) {
        log.text('wizard: plans loaded', log.level.INFO)
        $scope.plans = result.plans

        $scope.user.site.plan = _.find($scope.plans, { name: 'pro_subscription' })._id
      })
      .catch(function () {
        log.ui('wizard: plans not loaded', log.level.ERROR)
      })

    ApiService.get('siteengines')
      .then(function (result) {
        log.text('wizard: siteengines loaded', log.level.INFO)
        $scope.siteEngines = result.siteengines
        var plugin = _.find($scope.siteEngines, function (plugin) { return plugin.slug.toLowerCase() === 'woocommerce' })
        $scope.pluginUrl = plugin ? plugin.pluginUrl : '#'
        $scope.pluginPageUrl = plugin ? plugin.pluginPageUrl : '#'
      })
      .catch(function () {
        log.ui('wizard: siteengines not loaded', log.level.ERROR)
      })

    ApiService.get('campaignitemlanguages')
      .then(function (result) {
        log.text('wizard: languages loaded', log.level.INFO)
        $scope.campaignItemLanguages = _.map(result.campaignitemlanguages, function (element) {
          return {
            display: element.name,
            value: element._id
          }
        })
        var language = _.find($scope.campaignItemLanguages, function (element) {
          return element.display.indexOf('English') === 0
        })
        $scope.user.site.campaignItemLanguage = language ? language.value : ''
      })
      .catch(function () {
        log.ui('wizard: campaignitemlanguages not loaded', log.level.ERROR)
      })

    CurrencyService.ordered()
      .then(function (result) {
        log.text('wizard: currencies loaded', log.level.INFO)
        $scope.currencies = result

        $scope.user.site.currency = $scope.currencies[0].value
      })
      .catch(function () {
        log.ui('wizard: currencies not loaded', log.level.ERROR)
      })

    // scope functions
    $scope.shopifyModal = function ($event) {
      $modal.open({
        templateUrl: 'wizard/templates/shopify-modal.html',
        size: 'lg',
        scope: $scope
      })
    }

    $scope.planDescription = function () {
      var plan = _.find($scope.plans, {_id: $scope.user.site.plan})
      return plan ? plan.description : ''
    }
    $scope.getState = function (name, validity) {
      if (_.isBoolean(validity)) {
        stateQueue = _.map(stateQueue, function (obj) {
          if (obj.name === name) { obj.valid = validity }
          return obj
        })
        return stateQueue
      }
      return _.findWhere(stateQueue, {name: name})
    }

    $scope.nextState = function (name) {
      var index = _.findIndex(stateQueue, function (obj) { return obj.name === name })
      return index + 1 < stateQueue.length ? stateQueue[index + 1] : null
    }

    $scope.checkCountries = function () {
      return MeCountryService.countries()
    }

    $scope.goTo = function (stateName) {
      var view = $element.find('.form-views')
      var submit = view.find('button[type="submit"]')

      var currentIndex = _.findIndex(stateQueue, function (obj) { return obj.name === $state.current.name })
      var requestIndex = _.findIndex(stateQueue, function (obj) { return obj.name === stateName })
      stateQueue[requestIndex].started = moment()

      if (requestIndex < currentIndex) {
        $state.go(stateName)
      } else {
        var next = $scope.nextState($state.current.name)
        // submit.length === 1 az animálás miatt kell!
        if (next && next.name === stateName && submit.length === 1) {
          $scope.getState($state.current.name, false)
          submit.trigger('click')
        }
      }
    }

    $scope.next = function () {
      $scope.siteURL = $scope.user.site.domain.replace(/^(https?:\/\/)?(www)?\.?/g, '.')
      $scope.getState($state.current.name, true)
      var next = $scope.nextState($state.current.name)
      var curr = _.findWhere(stateQueue, {name: $state.current.name})
      if (next) {
        var page = _.findIndex(stateQueue, function (state) { return state.name === curr.name })
        var payload = { site_id: user.site.id }
        var type = 'wizard_page_' + (page + 1)
        payload[type] = moment.duration(moment().diff(curr.started)).asSeconds()
        Intercom.send(type, payload)

        next.started = moment()
        $state.go(next.name)
      } else {
        $scope.wizard()
      }
    }

    $scope.wizard = function () {
      var user = $scope.user
      var site = user.site
      var engineName = 'other'

      if (!site.antiSpam) { site.antiSpam = {} }
      if (!site.billing) { site.billing = {} }
      if (!site.account) { site.account = {} }
      if (!site.emailSettings) { site.emailSettings = {} }
      var index = _.findIndex($scope.siteEngines, function (engine) { return engine.name.toLowerCase() === site.engine.toLowerCase() || engine.id === site.engine })
      if (index === -1) {
        site.engine = _.find($scope.siteEngines, function (engine) { return engine.name.toLowerCase() === 'other' }).id
      } else {
        site.engine = $scope.siteEngines[index].id
        engineName = $scope.siteEngines[index].name
      }

      site.timeZone = TimeZones.convert(Intl.DateTimeFormat().resolvedOptions().timeZone)
      site.antiSpam.address = site.billing.address = site.account.address
      site.antiSpam.city = site.billing.city = site.account.city
      site.antiSpam.zipCode = site.billing.zipCode = site.account.zipCode
      site.antiSpam.country = site.billing.country = site.account.country
      site.antiSpam.phone = site.account.phone
      site.billing.company = site.account.company
      site.emailSettings.senderName = site.name
      site.discount.enabled = site.discount.amount > 0
      site.notifications = [{
        email: user.email,
        phone: '',
        daily: {
          email: false,
          sms: false
        },
        weekly: {
          email: true,
          sms: false
        },
        monthly: {
          email: false,
          sms: false
        }
      }]

      $state.go('wait.process')

      Intercom.send('wizard_page_3', {
        site_id: user.site.id,
        wizard_page_3: moment.duration(moment().diff(stateQueue[2].started)).asSeconds()
      })
        .then(function () {
          return Intercom.send('signup_ended', {
            site_id: user.site.id,
            time_spent_on_registration: moment.duration(moment().diff(stateQueue[0].started)).asSeconds(),
            platform: engineName,
            signup_ended: moment().toISOString(),
            sender_email: site.emailSettings.senderEmail,
            name: user.firstName + ' ' + user.lastName
          })
        })
        .catch(function () {
          log.ui('intercom signup: failed', log.level.ERROR)
        })
        .finally(function () {
          ApiService.post('auth/finish', user, 'me')
            .then(function () {
              log.ui('signup: success', log.level.SUCCESS)
              var state = site.engine ? 'app.dashboard' : 'app.me.plugins'

              return $state.go(state)
            })
            .catch(function () {
              log.ui('signup: failed', log.level.ERROR)
              $state.go('auth.login')
            })
            .finally(function () {
              Intercom.send('first_entered', {
                site_id: user.site.id,
                first_entered: moment().toISOString()
              })
              .then(function () {
                $window.fbq('track', 'CompleteRegistration')
              })
              .catch(function () {
                log.ui('intercom signup: failed', log.level.ERROR)
              })
              try {
                LeadDyno.recordLead(user.email)
              } catch (error) {
                log.text('LeadDyno Error occured: ' + JSON.stringify(error), log.level.ERROR)
              }
            })
        })
    }

    $scope.$watch('user.site.engine', function (engine) {
      var plugin = _.find($scope.siteEngines, function (plugin) { return plugin.slug.toLowerCase() === engine })
      $scope.pluginUrl = plugin ? plugin.pluginUrl : '#'
      $scope.pluginPageUrl = plugin ? plugin.pluginPageUrl : '#'
    })
  })
