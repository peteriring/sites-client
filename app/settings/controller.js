'use strict'

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider.state('app.me.settings', {
      url: '/account',
      templateUrl: 'settings/view.html',
      controller: 'SettingsController',
      data: {
        title: 'My Account'
      }
    })
  })

  .controller('SettingsController', function ($scope, $timeout, $q, ApiService, MeCountryService, log) {
    // ui values
    $scope.changePassword = {}
    $scope.user = {}
    $scope.states = []
    $scope.isNotificationChanged = {}
    $scope.notificationsSaving = false
    // init functions

    ApiService

      .get('me')
      .then(function (result) {
        log.text('settings: user loaded', log.level.DEBUG)

        var user = result.me
        var country = user.site.account.country

        $scope.user = user

        if (country) {
          return MeCountryService.states(country)
        }
      })
      .then(function (states) {
        log.text('settings: states loaded', log.level.DEBUG)

        $scope.states = states
      })
      .catch(function () {
        log.ui('settings: loading failure', log.level.ERROR)
      })

    $scope.$emit('me-title', 'My Account')

    // scope functions
    $scope.selectCountry = function (countryName) {
      $scope.user.site.account.state = ' '

      // TODO: only post if atomic
      // ApiService.put('me/update/site', {'account.state': ''})

      return MeCountryService

        .states(countryName)
        .then(function (states) {
          $scope.states = states
          return MeCountryService.countries()
        })
    }

    $scope.update = function () {
      var user = $scope.user
      var site = user.site
      var promise = $q.when(1)

      // industry
      if (!site.antiSpam.industry) {
        site.antiSpam.industry = site.account.industry
      }

      // company
      if (!site.antiSpam.company) {
        site.antiSpam.company = site.account.company
      }

      if (!site.billing.company) {
        site.billing.company = site.account.company
      }

      // state
      if (!site.antiSpam.state) {
        site.antiSpam.state = site.account.state
      }

      if (!site.billing.state) {
        site.billing.state = site.account.state
      }

      if ($scope.changePassword.password) {
        promise = ApiService.post('me/changePassword', $scope.changePassword)
      }

      return $q.all([promise, ApiService.put('me/update/user', user, 'me')])

        .then(function () {
          $scope.changePassword = {}
          log.ui('settings: account saved', log.level.SUCCESS)
        })
        .catch(function () {
          $scope.changePassword = {}
          log.ui('settings: saving account failed', log.level.ERROR)
        })
    }

    $scope.addNotification = function () {
      var notifications = $scope.user.site.notifications
      var notification = {
        email: '',
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
      }

      notifications.push(notification)
      $scope.changeNotifications(notifications.length)
    }

    $scope.removeNotification = function (index) {
      $scope.user.site.notifications.splice(index, 1)
      $scope.changeNotifications(index)
    }

    $scope.saveNotifications = function (index) {
      $timeout.cancel($scope.saveNotificationsPromise)

      $scope.notificationsSaving = true
      $scope.isNotificationChanged[index] = true

      return ApiService

        .put('me/update/site', { notifications: $scope.user.site.notifications }, 'me')
        .finally(function () {
          $scope.isNotificationChanged = {}
          $scope.notificationsSaving = false
        })
    }

    $scope.changeNotifications = function (index) {
      $timeout.cancel($scope.saveNotificationsPromise)

      $scope.isNotificationChanged[index] = true

      $scope.saveNotificationsPromise = $timeout(function () {
        $scope.saveNotifications(index)

          .then(function () {
            log.ui('settings: notifications saved', log.level.SUCCESS)
          })
          .catch(function () {
            log.ui('settings: saving notifications failed', log.level.ERROR)
          })
      }, 2000)

      return $scope.saveNotificationsPromise
    }

    $scope.submitPassword = function (model) {
      return ApiService

        .put('me/password', model)
        .then(function () {
          log.ui('password change: success', log.level.SUCCESS)
        })
        .catch(function () {
          log.ui('password change: failed', log.level.ERROR)
        })
    }
  })
