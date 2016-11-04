'use strict'

angular.module('GMClient')

  .directive('meMultipleRequired', function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.meMultipleRequired = function (modelValue, viewValue) {
          var val
          if (angular.isArray(modelValue)) {
            val = modelValue
          } else if (angular.isArray(viewValue)) {
            val = viewValue
          } else {
            return false
          }

          return val.length > 0
        }
      }
    }
  })

  .directive('meOptionalRequired', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var optionalValue

        scope.$watch(attrs.meOptionalRequired, function (newValue) {
          optionalValue = newValue
          ctrl.$validate()
        })

        ctrl.$validators.meOptionalRequired = function (modelValue, _viewValue) {
          return !optionalValue === !_viewValue
        }
      }
    }
  })
