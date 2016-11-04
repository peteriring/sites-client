'use strict'

angular.module('GMClient')

  .directive('verticalAlignCenter', function ($window) {
    return {
      link: function (scope, element, attrs) {
        var verticalCenter = element.parents('.vertical-center')
        function alignCenter () {
          var top = $window.innerHeight / 2 - verticalCenter.height() / 2
          verticalCenter.css('margin-top', top < 30 ? 30 : top)
        }
        scope.$watch(alignCenter)
      }
    }
  })
