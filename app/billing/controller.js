'use strict'
/* global _*/

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider.state('app.me.billing', {
      url: '/billing',
      templateUrl: 'billing/view.html',
      controller: 'BillingController',
      data: {
        title: 'Billing'
      },
      resolve: {
        ApiService: 'ApiService',
        log: 'log',
        user: function (ApiService, log) {
          return ApiService.get('me')
            .then(function (result) {
              log.text('billing: user loaded', log.level.DEBUG)
              return result.me
            })
        }
      }
    })
  })

  .controller('BillingController', function ($window, $scope, $modal, $state, $timeout, ApiService, MeCountryService, BillingCountriesService, log, user) {
    // ui values
    $scope.billing = {
      business_purpose: true
    }
    $scope.disableButton = false
    $scope.countries = BillingCountriesService.get()
    $scope.isSelectedEU = false
    $scope.onCountryChange = function (selected) {
      $scope.isSelectedEU = !!selected.isEU
    }
    // init functions
    log.text('billing: init', log.level.INFO)

    $scope.user = user

    $scope.$emit('me-title', 'Billing')
    $scope.processPayment = function () {
      $scope.modalStatus = 'pending'
      return ApiService.get('me/get_last_payment_status', {site_id: $scope.user.site.id})
      .then(function (result) {
        $scope.modalStatus = result.get_last_payment_status.status
      })
      .catch(function (error) {
        log.text(JSON.stringify(error))
        log.ui('billing: saving payment failed', log.level.ERROR)
        $scope.modalStatus = 'failed'
      })
      .finally(function () {
        ApiService.post('me/last_payment_callback', {site_id: $scope.user.site.id})
      })
    }

    $scope.updatePayment = function (token) {
      var params = _.extend($scope.billing, { recurly_token: token.id })

      return ApiService

        .post('me/subscribe', params)
        .then(function () {
          log.ui('billing: payment request sent', log.level.SUCCESS)
          $scope.modal = $modal.open({
            templateUrl: 'billing/templates/processing-modal.html',
            size: 'lg',
            scope: $scope,
            backdrop: 'static',
            keyboard: false
          })
          $scope.closeModal = function () {
            if ($scope.modalStatus === 'pending') return
            if ($scope.modalStatus === 'failed' || $scope.modalStatus === 'idle') return $scope.modal.close()

            $scope.modal.close()
            ApiService.clear()
            $state.go('app.dashboard')
            $window.location.reload()
          }

          return $scope.processPayment()
        })
        .catch(function (error) {
          log.text(JSON.stringify(error))
          log.ui('billing: subscribing failed', log.level.ERROR)
        })
    }
  })
