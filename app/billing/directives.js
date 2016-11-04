'use strict'

angular.module('GMClient')

  .directive('billingCreditCard', function ($timeout) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.billingCreditCard = function (modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // consider empty models to be valid
            return false
          }

          var value = viewValue || modelValue

          if (/[^0-9-\s]+/.test(value)) {
            return false
          }

          // The Luhn Algorithm. It's so pretty.
          var cDigit
          var nCheck = 0
          var nDigit = 0
          var bEven = false
          value = value.replace(/\D/g, '')

          for (var n = value.length - 1; n >= 0; n--) {
            cDigit = value.charAt(n)
            nDigit = parseInt(cDigit, 10)

            if (bEven && (nDigit *= 2) > 9) {
              nDigit -= 9
            }

            nCheck += nDigit
            bEven = !bEven
          }

          var isValid = (nCheck % 10) === 0

          var formGroup = elem.closest('.form-group')

          $timeout(function () {
            if (isValid) {
              formGroup.removeClass('has-error')
            } else {
              formGroup.addClass('has-error')
            }
          }, 10)

          elem.next('.help-block').text((isValid ? '' : 'Invalid card number'))

          return isValid
        }
      }
    }
  })

  .directive('recurlyForm', function (log, recurly) {
    return {
      scope: true,
      link: function (scope, elem, attrs) {
        var handler = scope[attrs.recurlyForm]
        recurly()
          .then(function (recurly) {
            elem.find('input').on('focus', function (event) {
              var input = event.currentTarget
              var formGroup = input.closest('.form-group')
              elem.find(formGroup).removeClass('has-error')
            })

            recurly.on('field:submit', function (event) {
              elem.submit()
            })

            elem.on('submit', function (event) {
              scope.disableButton = true
              if (!scope.$$phase) { scope.$apply() }
              event.preventDefault()
              recurly.token(elem, function (err, token) {
                if (token) {
                  return handler(token)
                    .finally(function () {
                      scope.disableButton = false
                      if (!scope.$$phase) { scope.$apply() }
                    })
                }
                scope.disableButton = false
                if (err.fields) log.ui(err.message + '\nat: ' + err.fields, log.level.ERROR)
                else log.ui(err.message, log.level.ERROR)

                log.text(JSON.stringify(err), log.level.ERROR)
                err.fields.forEach(function (field) {
                  var input = elem.find('[data-recurly=' + field + ']')
                  var formGroup = input.closest('.form-group')
                  input.children().addClass('has-error')
                  formGroup.addClass('has-error')
                })
              })
            })
          })
      }
    }
  })
