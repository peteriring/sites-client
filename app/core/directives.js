'use strict'
/* global $, _ */

angular.module('GMClient')

  // Handle global LINK click
  .directive('a', function () {
    return {
      restrict: 'E',
      link: function (scope, elem, attrs) {
        if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
          elem.on('click', function (e) {
            e.preventDefault() // prevent link click for above criteria
          })
        }
      }
    }
  })

  .directive('mock', function ($compile) {
    var template = '<div class="loader"><img src="images/loading.gif" alt="Loading"/></div>'

    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var children = elem.children()
        var hasChildren = children.length
        var content

        if (hasChildren) {
          content = children.hide()
        } else {
          content = elem.text()
          elem.html('')
        }

        var spinner = $(template).clone()
        var size = (attrs.size || parseInt(elem.css('font-size'), 10) + 36) + 'px'

        spinner
          .css('width', size)
          .appendTo(elem)

        scope.$watch(attrs.mock, function (newValue, oldValue) {
          if (newValue === oldValue && _.isUndefined(newValue)) {
            return
          }

          spinner.remove()
          if (hasChildren) {
            content.show()
          } else {
            elem.html(content)
            $compile(elem.contents())(scope)
          }
        })
      }
    }
  })

  /* .directive('forbid', function (ApiService, $compile) {
      return {
          restrict: 'A',
          scope: true,
          link: function (scope, elem, attrs) {

              ApiService

              .get('me')
              .then(function (result) {
                  var permissions = result.me.permissions
                  var disabled = permissions.indexOf(attrs.forbid) === -1
                  disabled = true
                  var node = elem.prop('nodeName')

                  if (!disabled) {

                      return
                  }

                  elem.on('click', function () {

                      return false
                  })
              })
          }
      }
  })*/

  .directive('selectDateRange', function ($q, $parse) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        scope.$watch(attrs.ngModel, function (value) {
          if (!value) {
            return
          }

          var promise = $parse(attrs.selectDateRange)(scope)

          elem

            .prop('disabled', true)
            .children('.fa-clock-o')
            .addClass('faa-spin animated')

          if ($q.when(promise)) {
            promise.finally(function () {
              elem

                .prop('disabled', false)
                .children('.fa-clock-o')
                .removeClass('faa-spin animated')
            })
          }
        })
      }
    }
  })

  .directive('trackingChecker', function ($parse, $window, $modal, ApiService) {
    return {
      restrict: 'A',
      transclude: true,
      template: '<div ng-transclude></div>',
      link: function (scope, elem, attrs, transclude) {
        elem.hide()

        scope.check = function () {
          ApiService

            .get('me/active')
            .then(function (result) {
              $modal.open({
                templateUrl: 'core/templates/welcomeModal.html',
                controller: 'WelcomeModalController'
              })

              // $window.Intercom('trackEvent', 'plugin-activated')
              elem.remove()
            }).catch(function (err) {
              if (err.status === 412) {
                scope.check()
              }
            })
        }

        ApiService

          .get('me')
          .then(function (result) {
            var user = result.me

            if (!user.site.isTrackingActive) {
              elem.show()
              scope.check()
            } else {
              elem.remove()
            }
          })
      }
    }
  })

  .directive('selectOnClick', ['$window', '$parse', function ($window, $parse) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        elem.on('click', function () {
          if (!$window.getSelection().toString()) {
            // Required for mobile Safari
            this.setSelectionRange(0, this.value.length)
          }
        })
      }
    }
  }])

  .directive('scrollTo', function ($window) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        elem.on('click', function () {
          var $anchor = $('#' + attrs.scrollTo)
          if (!$anchor.length) return

          $('html, body').animate({
            scrollTop: $('#' + attrs.scrollTo).offset().top - 10
          }, 1000)
        })
      }
    }
  })

  .directive('parentClassificator', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var className = attrs.parentClassificator
        elem.parent().addClass(className)
      }
    }
  })

  .directive('trialDays', function () {
    return {
      template: '<span>' +
        '<a ng-if="false" href="#" class="active-btn" ng-class="{active: isTrackingActive}">' +
        '<span ng-if="isTrackingActive">Plugin: Active</span>' +
        '<span ng-if="!isTrackingActive" ui-sref="app.me.plugins">Plugin: Inactive - Fix this!</span>' +
        '</a>' +
        '<a ng-if="isBillingTrial" ui-sref="app.me.billing" class="trial-btn"><span class="icon-clock"></span>{{ trialDaysLeft }} days left in your free trial</a>' +
        '<a ng-if="isBillingInactive" ui-sref="app.me.billing" class="trial-btn ended"><span class="icon-clock"></span>Your trial is expired</a>' +
        '</span>',
      replace: true,
      restrict: 'E',
      link: function (scope, elem, attrs) {
        var end = new Date(scope.user.site.trialEndsAt)
        var now = new Date()
        var diff = end.getTime() - now.getTime()
        var days = Math.ceil(diff / (24 * 60 * 60 * 1000))
        scope.trialDaysLeft = Math.max(days, 0)
        scope.isBillingTrial = scope.user.site.isBillingActive === 'trial'
        scope.isBillingInactive = scope.user.site.isBillingActive === 'inactive'
        scope.isTrackingActive = scope.user.site.tracking.status !== 'inactive'
      }
    }
  })

  .directive('trialExpireAlert', function (ApiService) {
    return {
      templateUrl: 'core/templates/trialExpireAlert.html',
      replace: true,
      restrict: 'E',
      link: function (scope, elem, attrs) {
        ApiService
          .get(['me', 'currencies', 'me/statistics'])
          .then(function (response) {
            scope.recoveredRevenue = response.statistics.site.statistics.recoveredRevenue
          })
        scope.billingEnabled = (scope.user.site.isBillingActive === 'active' || scope.user.site.isBillingActive === 'trial')
        if (scope.billingEnabled) elem.remove()
      }
    }
  })

  .directive('loaderPopup', function (ApiService, $interval, $window) {
    return {
      template: '<div class="loadprogress" ng-hide="buildFinished">Loading ...</div>',
      replace: true,
      restrict: 'E',
      scope: {},
      link: function (scope, elem, attrs) {
        var width = $window.innerWidth

        scope.buildFinished = false
        elem.css('position', 'fixed')
        elem.css('width', '150px')
        elem.css('height', '50px')
        elem.css('z-index', '100')
        elem.css('margin-left', ((width - 150) / 2).toString() + 'px')

        scope.$watch(ApiService.running, function (running) {
          scope.buildFinished = !running
        })
      }
    }
  })

  .directive('dynamicFontSize', function ($filter) {
    return {
      template: '<span>{{text}}</span>',
      restrict: 'E',
      scope: {
        value: '='
      },
      link: function (scope, elem, attrs) {
        var originalSize = ''

        var change = function (newValue) {
          if (typeof newValue !== 'number') return
          var size = attrs.size

          scope.text = $filter('gmCurrency')(newValue)
          if (size === 'large') originalSize = 60
          else if (size === 'medium') originalSize = 36
          else originalSize = 30

          var diffUnit = (originalSize / 10) - 1
          var length = scope.text.toString().length

          if (length >= 10) return elem.css('font-size', (originalSize - (diffUnit * 3)) + 'px')
          if (length >= 7) return elem.css('font-size', (originalSize - diffUnit) + 'px')
        }

        scope.$watch('value', change)
        scope.text = ''
      }
    }
  })
