'use strict'

angular.module('GMClient').controller('IdleModalController', function ($scope, $modalInstance, $auth, $state, log, user, ApiService) {
  // ui values
  $scope.userName = user.firstName + ' ' + user.lastName
  $scope.user = {
    email: user.email,
    password: ''
  }

  // init functions
  $auth.logout(false)
  ApiService.stop()
  // scope functions
  $scope.unlock = function () {
    return $auth

      .login($scope.user)
      .then(function (result) {
        ApiService.start()
        $modalInstance.close(result.data.user)
      })
      .catch(function () {
        log.ui('login: failed', log.level.ERROR)
      })
  }

  $scope.close = function () {
    $modalInstance.dismiss('cancel')
    $state.go('auth.login')
  }
})
