'use strict'
/* global $, _, Image, FileReader, localStorage */

angular.module('GMClient')

  .directive('gmSlider', function ($timeout, $animate) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div></div>',
      link: function (scope, elem, attrs) {
        var model = attrs.model
        var slider = elem.slider({
          range: false,
          min: 0,
          max: 100,
          value: scope[model],
          slide: function (event, ui) {
            var timer
            scope.$apply(function () {
              scope[model] = ui.value
              box.text(scope[model] + 'px')
              box.css('left', ui.handle.style.left)
              box.addClass('custom-hide-remove')
              box.removeClass('custom-hide-active')
              if (timer) { $timeout.cancel(timer) }
              timer = $timeout(function () {
                box.removeClass('custom-hide-remove')
                box.addClass('custom-hide-active')
              }, 1500)
            })
          }
        })
        slider.css('user-select', 'none')
        slider.append('<span class="slider-value custom-hide-active"></span>')
        var box = slider.children('.slider-value')
      }
    }
  })

  .directive('emailFrame', function ($compile, $filter) {
    return function (scope, element) {
      var body = angular.element(element[0].contentDocument.body)
      var template = $compile('<div ng-bind-html="compiled | campaignsMock:user.site"></div>')(scope)
      body.contents().remove()
      body.append(template)
      scope.$watch('schema.text.h1.value', function () {})
    }
  })

  .directive('textBind', function ($compile) {
    var whitelist = ['br', 'a', 'p', 'strong']
    var tagSelector = /(<\/?)([^>]*)(>)/g
    var bindSelector = /(\{\{)([^}}]*)(\}\})/g

    return {
      scope: {
        property: '=textBind'
      },
      link: function (scope, elem, attrs) {
        var examples = (scope.$parent && scope.$parent.schema && scope.$parent.schema.exampleVariables) ? scope.$parent.schema.exampleVariables : {}
        _.defaults(scope, examples)

        var text = scope.property.value || scope.property.default || '...'
        var replaceTags = function (match) {
          var tagSelectorClone = /(<\/?)([^>]*)(>)/g
          var matches = tagSelectorClone.exec(match)

          if (!matches) {
            return ''
          }
          var tag = matches[2].trim()
          var matched = false
          _.each(whitelist, function (listedTag) {
            var tagMatcher = new RegExp('^' + listedTag + '[ >]?')
            matched = matched || tagMatcher.test(tag)
          })
          return matched ? match : [ matches[1].replace('<', '&lt;'), matches[2].replace('&', '&amp;'), '&gt;' ].join('')
        }
        var replaceBinds = function (match) {
          var bind = match.slice(2, match.length - 2).trim()
          return scope[bind]
        }

        if (scope.property.type === 'textarea' || scope.property.type === 'hidden') {
          text = text.replace(bindSelector, replaceBinds)
          text = text.replace(tagSelector, replaceTags)
          elem.html(text)
        } else {
          elem.text(text)
        }
      }
    }
  })

  .directive('preview', function ($filter) {
    return {
      restrict: 'E',
      link: function link (scope, elem, attrs) {
        var still = (/^.*height: [0-9]*px.*/g.test(attrs.style))
        var iframe = document.createElement('iframe')
        angular.element(iframe).attr('style', attrs.style)
        if (still) angular.element(iframe).attr('still', still)
        var element0 = elem[0]
        element0.appendChild(iframe)
        scope.$watch(attrs.template, function () {
          var template = $filter('campaignsMock')(scope.compiled, scope.user.site)
          scope.assemble(function () {
            var frame = angular.element(iframe)
            frame.attr('scrolling', 'no')
            frame.attr('srcdoc', template)
              .on('load', function () {
                scope.recompile()
              })
          })
        })
      }
    }
  })

  .directive('filereader', function ($q) {
    var slice = Array.prototype.slice
    var fileTypes = ['jpg', 'jpeg', 'png', 'gif']
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, elem, attrs, ctrl) {
        if (!ctrl) { return }

        ctrl.$render = function () {}

        elem.bind('change', function (e) {
          var elem = e.target
          var extension = elem.value.split('.').pop().toLowerCase()
          if (fileTypes.indexOf(extension) <= -1) { return }

          $q.all(slice.call(elem.files, 0)
            .map(scope.readFile))
            .then(function (values) {
              var show = values
              if (!elem.multiple) { show = values.length ? values[0] : null }

              scope.resizeImage(show, 550, function (image) {
                ctrl.$setViewValue(image)
                if (attrs.filereader) { localStorage.setItem(attrs.filereader, image) }
              })
            })
        })
      }
    }
  })
  .directive('dropZone', function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var lastenter = null

        if (!ctrl) { return }

        ctrl.$render = function () {}

        var drag = function (event) {
          event.dataTransfer = event.originalEvent.dataTransfer

          if (event != null) {
            event.preventDefault()
          }
          event.dataTransfer.effectAllowed = 'copy'

          if (event.type === 'dragenter') {
            lastenter = event.target
            elem.addClass('drop-zone-active')
            elem.removeClass('drop-zone-inactive')
          }

          if (event.type === 'dragleave' && lastenter === event.target) {
            elem.addClass('drop-zone-inactive')
            elem.removeClass('drop-zone-active')
          }

          return false
        }

        elem.bind('dragover', drag)
        elem.bind('dragenter', drag)
        elem.bind('dragleave', drag)

        elem.bind('drop', function (event) {
          elem.addClass('drop-zone-inactive')
          elem.removeClass('drop-zone-active')

          event.preventDefault()
          event.dataTransfer = event.originalEvent.dataTransfer
          var file = event.dataTransfer.files[0]

          scope.readFile(file)
            .then(function (value) {
              scope.resizeImage(value, 550, function (image) {
                ctrl.$setViewValue(image)
                if (attrs.dropZone) { localStorage.setItem(attrs.dropZone, image) }
              })
            })
        })
      }
    }
  })

  .directive('uploaderWrapper', function ($q, $timeout) {
    return {
      templateUrl: 'editor/templates/imageLoader.html',
      replace: true,
      restrict: 'E',
      scope: {
        model: '=',
        fallback: '=',
        compile: '&'
      },
      link: function (scope, elem, attrs) {
        var container = elem.find('.progress-container')
        var resetProgressBar = function () {
          $timeout(function () {
            scope.progress = 0
            container.hide()
          }, 2000)
        }

        scope.progress = 0
        scope.storagename = attrs.storagename

        scope.readFile = function (file) {
          var deferred = $q.defer()
          var reader = new FileReader()

          reader.onload = function (e) {
            deferred.resolve(e.target.result)
            resetProgressBar()
          }
          reader.onerror = function (e) {
            deferred.reject(e)
            resetProgressBar()
          }
          reader.onprogress = function (e) {
            scope.progress = (e.loaded / e.total) * 100
          }

          reader.readAsDataURL(file)
          scope.progress = 0
          container.show()
          return deferred.promise
        }

        scope.resizeImage = function (url, size, callback) {
          var sourceImage = new Image()
          sourceImage.onload = function (event) {
            var canvas = document.createElement('canvas')
            // var scale = size / sourceImage.width

            canvas.width = sourceImage.width > size ? size : sourceImage.width
            canvas.height = sourceImage.height > size ? size : sourceImage.height

            canvas.getContext('2d').drawImage(sourceImage, 0, 0, canvas.width, canvas.height)
            scope.model = canvas.toDataURL()
            callback(canvas.toDataURL())
          }

          sourceImage.src = url
        }

        scope.resetImage = function () {
          scope.model = scope.fallback
          localStorage.setItem(scope.storagename, scope.model)
          scope.compile()
        }
      }
    }
  })

  .directive('popoverHandler', function ($templateRequest) {
    return {
      restrict: 'E',
      template: function (elem, attrs) {
        return '<a data-toggle="popover" class="secondary-btn medium-btn reset-button">' + elem.html() + '</a>'
      },
      scope: {
        handler: '&'
      },
      link: function link (scope, elem, attrs) {
        $templateRequest('editor/templates/popover.html')
          .then(function (content) {
            elem.find('[data-toggle="popover"]').popover({
              html: true,
              placement: 'bottom',
              trigger: 'click',
              content: content
            }).on('shown.bs.popover', function () {
              var popup = $(this)
              $(this).next('.popover')
                .find('.danger-button')
                .click(function (event) {
                  // success
                  scope.handler()
                  popup.popover('hide')
                })
              $(this).next('.popover')
                .find('.success-button')
                .click(function (event) {
                  popup.popover('hide')
                })
            })
          })
      }
    }
  })

  .directive('nl2br', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelController) {
        ngModelController.$parsers.push(function (data) {
          // convert data from view format to model format
          return data ? data.replace(/\n/g, '<br>') : data
        })

        ngModelController.$formatters.push(function (data) {
          // convert data from model format to view format
          return data ? data.replace(/<br>/g, '\n') : data
        })
      }
    }
  })

  .directive('dynamicPlaceholder', function () {
    return {
      scope: {
        value: '=dynamicPlaceholder'
      },
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.attr('placeholder', scope.value)
      }
    }
  })
