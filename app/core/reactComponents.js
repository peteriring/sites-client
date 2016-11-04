'use strict'
/* global */

angular.module('GMClient')

  .factory('reactComponents', function ($compile, $q, $timeout) {
    return {
      Daterangepicker: function (scope, cb) {
        scope.selectRange = cb
        var input = $compile('<react-component-daterangepicker select-range="selectRange" user="user"/>')(scope)
        return input
      }
    }
  })

  .directive('reactComponentDaterangepicker', function ($compile, $timeout, DatePickerConfig, iframeService) {
    return {
      restrict: 'E',
      scope: {
        selectRange: '=',
        user: '='
      },
      link: function (scope, elem, attrs) {
        var template = '<input date-range-picker options="picker.options" ng-model="picker.range" select-date-range="selectRange(picker)" min="picker.minDate" max="picker.maxDate" />'
        var input = $compile(template)(scope)
          .attr('name', 'daterange')
          .attr('type', 'hidden')
          .daterangepicker(scope.picker)
          .appendTo(elem)

        scope.picker = new DatePickerConfig(scope.user.site.createdAt)
        scope.handlers = iframeService.handlers
        iframeService.addHandler('triggerDateRangePopup', function (message) {
          var iframe = angular.element('iframe')
          input.trigger('click')
          input.css({
            position: 'absolute',
            top: iframe.position().top + message.data.y,
            left: iframe.position().left + message.data.x
          })

          angular.element('div.daterangepicker.dropdown-menu')
            .css({
              top: iframe.position().top + message.data.y,
              left: iframe.position().left + message.data.x
            })
            .on('click', function () {
              angular.element(this).css({
                top: iframe.position().top + message.data.y,
                left: iframe.position().left + message.data.x
              })
            })
            .on('blur', function (event) {
              var list = event.relatedTarget ? event.relatedTarget.classList : null
              if (list && (list.contains('applyBtn') || list.contains('cancelBtn'))) return
              var target = event.relatedTarget
              if (target && (target.classList.contains('monthselect') || target.classList.contains('yearselect'))) {
                var _this = this
                angular.element(_this).focus()
                return angular.element(target).on('change', function (event) {
                  angular.element(_this).focus()
                  angular.element(_this).css('opacity', '0')
                  $timeout(function () {
                    angular.element(_this).css({
                      opacity: '1',
                      top: iframe.position().top + message.data.y,
                      left: iframe.position().left + message.data.x
                    })
                  }, 0)
                })
              }
              angular.element(this).find('button.applyBtn').trigger('click')
            })
            .attr('tabindex', -1)
            .focus()
        })
      }
    }
  })
