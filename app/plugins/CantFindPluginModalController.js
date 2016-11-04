'use strict'

angular.module('GMClient')

  .controller('CantFindPluginModalController', function ($scope, $modalInstance, PluginEngines) {
    $scope.ui = {
      custom: '',
      engine: '',
      engines: PluginEngines()
    }

    $scope.$watch('ui.custom', function () {
      $scope.ui.engine = ''
    })

    $scope.$watch('ui.engine', function () {
      $scope.ui.custom = ''
    })

    $scope.ok = function () {
      $modalInstance.close($scope.ui.custom || $scope.ui.engine)
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel')
    }
  })
