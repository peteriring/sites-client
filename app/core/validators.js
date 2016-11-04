'use strict'
/* global event, _ */

angular.module('GMClient')

  .directive('gmForm', function ($q, $parse, $state, ApiService) {
    return {
      restrict: 'E',
      scope: true,
      controllerAs: 'gmForm',
      require: 'gmForm',
      template: function (elem) {
        return elem.html()
      },
      controller: function ($scope) {
        this.handler = ''
        this.isAtomic = false
        this.endPoint = ''
        this.link = ''
        this.validationPromises = []

        this.handlePermission = function (access, button) {
          if (access) {
            ApiService

              .get('me')
              .then(function (result) {
                var permissions = result.me.role.permissions
                if (permissions.indexOf('all') === -1 && permissions.indexOf(access) === -1) {
                  $scope.$broadcast('disable')
                  button.prop('disabled', true)
                }
              })
          }
        }

        this.submit = function () {
          var _this = this

          $scope.validity = false
          this.validationPromises = []
          $scope.$broadcast('validate')
          $scope.$broadcast('getValidity')
          return $q

            .all(this.validationPromises)

            .then(function (validations) {
              if (!_this.isAtomic) {
                // note: https://groups.google.com/forum/#!msg/angular/yyH3FYAy5ZY/APANNMnolD8J
                //      a mĹ±velet sync, ezĂ©rt erre lehet alapozni
                $scope.$broadcast('get')
              }
              $scope.validity = _.every(validations)

              if (!$scope.validity) {
                return
              }

              $scope.update = _.reduce($scope.update, function (result, value, key) {
                key = key.replace('model.', '')
                result[key] = value || ''
                return result
              }, {})

              if (_this.link) {
                $state.go(_this.link)
              }

              if (_this.handler) { return $parse(_this.handler)($scope, {value: $scope.update}) }

              return ApiService.put(_this.endPoint, $scope.update, 'me')
            })
            .then(function () {
              $scope.update = {}
            })
        }
      },
      link: function (scope, elem, attrs, ctrl) {
        scope.inputsValidity = []
        scope.model = {}
        scope.trigger = attrs.trigger
        scope.update = {}
        scope.button = elem.find('button[type="submit"]')
        scope.text = scope.button.text()

        ctrl.endPoint = attrs.endpoint
        ctrl.isAtomic = (attrs.atomic === 'true')
        ctrl.handler = attrs.handler
        ctrl.link = scope.button.attr('link')

        ctrl.handlePermission(attrs.access, scope.button)
        if (attrs.icon) {
          scope.button.html(' <i class="' + attrs.icon + '"></i> ' + scope.text)
        }

        scope.getValidity = function () {
          ctrl.validationPromises = []
          scope.$broadcast('getValidity')
          scope.validity = $q

            .all(ctrl.validationPromises)

            .then(function (validations) {
              return _.every(validations)
            })
        }

        scope.$watch($parse(attrs.model), function (newValue) {
          scope.model = newValue
        })

        scope.submit = function () {
          var promise = ctrl.submit()
          scope.update = {}

          if (promise && $q.when(promise)) {
            scope.button
              .prop('disabled', true)
              .html(' <i class="' + attrs.icon + ' ' + attrs.animation + '"></i> ' + scope.text)

            promise.finally(function () {
              scope.button

                .prop('disabled', false || (attrs.trigger === 'init' ? !scope.validity : false))
                .html(' <i class="' + attrs.icon + '"></i> ' + scope.text)
            })
          }
        }

        elem.on('submit', function () {
          scope.submit()
        })

        elem.on('blurSubmit', function () {
          if (!ctrl.isAtomic) { return }

          scope.submit()
        })

        scope.$on('post', function (event, data) {
          event.stopPropagation()

          if (ctrl.isAtomic) {
            scope.update = {}
          }

          _.extend(scope.update, data)
        })

        scope.$on('refreshValidity', function () {
          scope.getValidity()
        })

        scope.$on('setValidity', function (event, data) {
          ctrl.validationPromises.push(data)
        })

        scope.button.on('click', scope.submit)
      }
    }
  })

  .directive('gmInput', function ($q, $parse, $timeout, ApiService, ValidatorService) {
    return {
      restrict: 'E',
      scope: true,
      controllerAs: 'gmInput',
      require: 'gmInput',
      template: function (elem, attrs) {
        var string = _.reduce(['property', 'multi', 'placeholder', 'array', 'before', 'change', 'after', 'save', 'display', 'absolute', 'searchDisabled'], function (memo, prop) {
          return memo + (attrs[prop] ? ('' + prop + '="' + attrs[prop] + '" ') : '')
        }, '<' + attrs.type + ' ')

        string = string + '>'
        string = string + '</' + attrs.type + '>' + '<div class="help-block with-errors" ng-repeat="message in messages">{{message}}</div>'

        return string
      },
      controller: function ($scope) {
        this.setValidators = function (obj) {
          if (!obj) {
            return []
          } else if (obj.indexOf('[') !== -1 && obj.indexOf(']') !== -1) {
            return $parse(obj)($scope)
          } else {
            return [obj]
          }
        }
        this.onBlur = function (elem, type) {
          var _this = this
          if ($scope.trigger !== 'submit') {
            _this.validate()
            if ($scope.validationPromise) {
              $scope.validationPromise.then(function (result) {
                if (!result) {
                  _this.restore()
                }
              })
            } else if (!$scope.validity) {
              _this.restore()
            }
          }

          if ($scope.original === this.getValue() && type === 'blurSubmit') {
            return
          }

          this.onSubmit(elem, type)
        }
        this.onFocus = function () {
          if (!$scope.shouldValidate && $scope.trigger !== 'submit') {
            $scope.shouldValidate = true
            this.validate()
          }
          $scope.original = this.getValue()
        }
        this.onSubmit = function (elem, type) {
          this.post()

          elem.trigger(type)
        }
        this.post = function () {
          var obj = {}
          obj[$scope.property] = this.getValue()
          $scope.$emit('post', obj)
        }
        this.restore = function () {
          this.setValue($scope.original)

          if (!$scope.$$phase) { $scope.$apply() }
        }
        this.getValue = function () {
          return $parse($scope.property)($scope)
        }
        this.setValue = function (value) {
          $parse($scope.property).assign($scope, value)
        }
        this.validate = function () {
          var _this = this
          var deferral = $q.defer()
          var validators = _.map($scope.validators, function (value) {
            var parsand = (value.match(/{([^{}])*}/g))
            if (parsand) {
              var parsed = $parse(parsand.toString().replace('{', '').replace('}', ''))($scope) || ''
              return value.replace(/{([^{}])*}/g, parsed)
            }
            return value
          })

          $scope.validationPromise = ValidatorService

            .isValid(this.getValue(), validators)

            .then(function (result) {
              if (_.isString(result.validity)) {
                _this.setValue(result.validity)
                result.validity = true
              }
              $scope.messages = result.messages
              $scope.validity = result.validity
              deferral.resolve($scope.validity)

              return result.validity
            })
        }
      },
      link: function (scope, elem, attrs, ctrl) {
        scope.original = ''
        scope.validity = true
        scope.property = attrs.property
        scope.validators = ctrl.setValidators(attrs.validate)
        scope.formGroup = elem.closest('.form-group')
        scope.focused = false

        $timeout(function () {
          scope.trigger = $parse('trigger')(scope)
          scope.original = ctrl.getValue(attrs.property)
          scope.shouldValidate = (scope.trigger === 'init')

          if (scope.trigger !== 'submit') {
            scope.$watch($parse(attrs.property), function () {
              if (scope.shouldValidate) {
                if (scope.timeout) { $timeout.cancel(scope.timeout) }

                scope.timeout = $timeout(function () {
                  ctrl.validate()
                }, 500) }
            })
          }
        }, 0)

        scope.$watch('validity', function (value) {
          scope.setViewValidation(value)
        })

        scope.setViewValidation = function () {
          if (scope.validity) {
            scope.formGroup.removeClass('has-error')
          } else {
            scope.formGroup.addClass('has-error')
          }
        }

        elem.on('focusin', function () {
          scope.focused = true
          ctrl.onFocus(attrs.property)
        })
          .on('focusout', function () {
            scope.focused = false
            ctrl.onBlur(elem, 'blurSubmit')
          })
          .on('enterOut', function () {
            ctrl.onBlur(elem, 'submit')
            document.activeElement.blur()
          })
          .on('keydown keypress', function () {
            if (event.keyCode === 13) {
              // ENTER
              elem.trigger('enterOut')
            } else if (event.keyCode === 27) {
              // ESCAPE
              ctrl.restore()

              document.activeElement.blur()
            } else if (event.keyCode === 9) {
              // TAB
            }
          })

        scope.$on('get', function () {
          ctrl.post()
        })

        scope.$on('validate', function () {
          ctrl.validate()
        })

        scope.$on('getValidity', function () {
          scope.$emit('setValidity', scope.validationPromise || scope.validity)
        })
      }
    }
  })
  .directive('text', function () {
    return {
      restrict: 'E',
      require: '^gmInput',
      template: function (elem, attrs) {
        return '<input ng-model="' + attrs.property + '" ' + (attrs.placeholder ? 'placeholder="' + attrs.placeholder + '"' : '') + ' class="form-control custom-form-control">'
      },
      link: function (scope, elem) {
        scope.$on('disable', function () {
          elem.find('input').prop('disabled', true)
        })
      }
    }
  })

  .directive('password', function () {
    return {
      restrict: 'E',
      require: '^gmInput',
      template: function (elem, attrs) {
        return '<div class="password-field-container">' +
        '<input ng-model="' + attrs.property + '" type="{{showPassword}}" class="form-control custom-form-control" aria-label="..." ' + (attrs.placeholder ? 'placeholder="' + attrs.placeholder + '"' : '') + '>' +
        '<span ng-mousedown="showPassword=show()" ng-mouseup="showPassword=\'password\'" ng-mouseleave="showPassword=\'password\'" class="icon-container">' +
        '<span class="icon-eye"></span>' +
        '</span>' +
        '</div>'
      },
      link: function (scope, elem) {
        var disabled = false
        scope.showPassword = 'password'

        scope.show = function () {
          return (disabled) ? 'password' : 'text'
        }

        scope.$on('disable', function () {
          disabled = true
          elem.find('input').prop('disabled', true)
          elem.find('span').removeClass('custom-cursor-pointer')
        })
      }
    }
  })

  .directive('gmSelect', function ($timeout, $parse) {
    return {
      restrict: 'E',
      scope: true,
      require: '^gmInput',
      template: function (elem, attrs) {
        return '<ui-select input-select search-enabled="false" on-select="finish($item)" ng-model="' + attrs.property + '" ' + (attrs.absolute === 'false' ? '' : 'append-to-body ') + ((attrs.multi === 'true') ? 'multiple' : '') + '>' +
        '<ui-select-match placeholder="' + attrs.placeholder + '">{{' + ((attrs.display) ? (attrs.display.replace('element', '$select.selected')) : ((attrs.multi === 'true') ? '$item' : '$select.selected')) + '}}</ui-select-match>' +
        '<ui-select-choices refresh="refresh($select.search)" repeat="' + ((attrs.save) ? (attrs.save + ' as ') : '') + 'element in array | filter:$select.search">' +
        '{{' + (attrs.display || 'element') + '}}' +
        '</ui-select-choices>' +
        '</ui-select>'
      },
      link: function (scope, elem, attrs, ctrl) {
        scope.original = ''
        scope.array = []
        scope.$watch($parse(attrs.array), function (newValue) {
          scope.array = newValue
          if (attrs.before) {
            var before = $parse(attrs.before)(scope)

            before(ctrl.getValue(attrs.property))

              .then(function (result) {
                scope.array = result
              })
          }
        })

        scope.finish = function () {
          if (attrs.after) {
            var after = $parse(attrs.after)(scope)

            after(ctrl.getValue(attrs.property))

              .then(function (result) {
                scope.array = result
              })
          }

          ctrl.onBlur(elem, attrs.property, 'blurSubmit')
        }

        scope.refresh = function (value) {
          if (attrs.change) {
            var change = $parse(attrs.change)(scope)

            change(value)

              .then(function (result) {
                scope.array = result
              })
          }
        }

        scope.$on('disable', function () {
          $timeout(function () {
            elem.find('.ui-select-container').prepend('<div class="ui-select-disable"></div>')
          })
        })
      }
    }
  })
