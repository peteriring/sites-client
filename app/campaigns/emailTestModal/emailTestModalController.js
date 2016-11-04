'use strict'
/* global */

angular.module('GMClient')

  .controller('emailTestModalController', function ($scope, ApiService, $modalInstance, log, $http) {
    var regexp = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i

    $scope.sendTest = function () {
      var input = angular.element(document.querySelector('.action-block__input'))
      var email = input.val()
      var isNotValid = !regexp.test($scope.text)
      var modalError = angular.element(document.querySelector('.has-error'))

      if (isNotValid) {
        modalError.show()
        input.addClass('input-error')
      } else {
        modalError.hide()
        input.removeClass('input-error')

        ApiService

          .get('me/sendTestEmails', { email: email })
          .then(function () {
            log.ui('Test emails sent succesfully')
            $modalInstance.close()
          })
          .catch(function () {
            log.ui('sendTestEmails: sending failure', log.level.ERROR)
          })
      }
    }

    $scope.subscribeUnderConstruction = function () {
      var input = angular.element(document.querySelector('.action-block__input'))
      var email = input.val()
      var isNotValid = !regexp.test($scope.text)
      var modalError = angular.element(document.querySelector('.has-error'))
      var list = '07d594a2f6'

      if (isNotValid) {
        modalError.show()
        input.addClass('input-error')
      } else {
        modalError.hide()
        input.removeClass('input-error')

        ApiService

        .post('me/mailchimp/subscribe', {
          email: email,
          list: list
        })
        .then(function () {
          log.ui('The subscription was succesfull')
          $modalInstance.close()
        })
        .catch(function () {
          log.ui('emailSubscription: sending failure', log.level.ERROR)
        })
      }
    }
  })
