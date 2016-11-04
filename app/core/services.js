'use strict'
/* global LE, moment, _ */

angular.module('GMClient')

  .factory('CurrencyService', function (ApiService, $q) {
    var currencies = []
    var pickArray = []
    var order = function () {
      pickArray = _.chain(currencies)
      .map(function (currency) {
        return {
          display: currency.name,
          value: currency._id
        }
      })
      .sortBy(function (currency) {
        return currency.display
      })
      .sortBy(function (currency) {
        if (currency.display === 'US Dollar') { return 0 }
        if (currency.display === 'UK Pound') { return 1 }
        if (currency.display === 'Euro') { return 2 }
        if (currency.display === 'Hungarian Forint') { return 3 }

        return 4
      })
      .value()
      return pickArray
    }
    return {
      generate: function () {
        var deferred = $q.defer()
        if (currencies.length > 0) {
          deferred.resolve(currencies)
        } else {
          ApiService.get('currencies')
            .then(function (result) {
              currencies = result.currencies
              deferred.resolve(currencies)
            })
        }
        return deferred.promise
      },
      ordered: function () {
        var deferred = $q.defer()
        if (pickArray.length > 0) {
          deferred.resolve(pickArray)
        } else {
          ApiService.get('currencies')
            .then(function (result) {
              currencies = result.currencies
              pickArray = result.currencies
              deferred.resolve(order())
            })
        }
        return deferred.promise
      }
    }
  })

  .factory('log', function ($log, ENV, Notification) {
    var log = {
      current: 0,
      environments: {
        development: 0,
        staging: 1,
        production: 2
      },
      levels: {
        DEBUG: 0,
        WARN: 1,
        ERROR: 2,
        INFO: 3,
        SUCCESS: 4
      },
      text: [
        $log.debug,
        $log.warn,
        $log.error,
        $log.info,
        $log.debug
      ],
      ui: [
        Notification,
        Notification.warning,
        Notification.error,
        Notification.info,
        Notification.success
      ],
      dateFormat: 'YYYY-MM-DD - HH:mm:ss'
    }

    // init
    // TODO: try - catch csak a tesztek miatt kell?
    try {
      LE.init(ENV.logentriesToken)
      log.current = log.environments[ENV.name]
    } catch (error) {
      // console.log('error', error.message)
      log.text[log.levels.DEBUG](error.message)
    }

    return {
      text: function (text, level) {
        if (typeof level === 'undefined') {
          level = log.levels.DEBUG
        }

        if (level < log.current) {
          return
        }

        var date = moment().format(log.dateFormat)
        log.text[level](date + ' ' + text)
      },
      ui: function (text, level) {
        if (typeof level === 'undefined') {
          level = log.levels.DEBUG
        }

        if (level < log.current) {
          return
        }

        var date = moment().format(log.dateFormat)
        log.text[level](date + ' ' + text)
        log.ui[level].call(Notification, text)
      },
      level: log.levels
    }
  })

  .factory('IdleService', function ($rootScope, $modal, Notification, Idle, log) {
    var user

    $rootScope.$on('IdleStart', function () {
      log.text('warning: user idle for an hour', log.level.INFO)
    })

    $rootScope.$on('IdleTimeout', function () {
      $modal.open({
        templateUrl: 'core/templates/idleModal.html',
        controller: 'IdleModalController',
        backdrop: 'static',
        keyboard: false,
        animation: false,
        openedClass: 'expired-modal-body',
        backdropClass: 'expired-modal-backdrop',
        windowClass: 'expired-modal-window',
        resolve: {
          user: function () {
            return user
          }
        }
      }).result.then(function (_user) {
        user = _user
        Idle.watch()
      })
    })

    return {
      start: function (_user) {
        user = _user
        Idle.watch()
      },
      stop: function () {
        Idle.unwatch()
      }
    }
  })

  .factory('DatePickerConfig', function () {
    return function (siteCreatedAt) {
      var createdAt = moment(siteCreatedAt).startOf('day')
      var startDate = moment().subtract(30, 'days').startOf('day')
      startDate = startDate.diff(createdAt) > 0 ? startDate : createdAt

      var ranges = [
        ['Today', [moment(), moment()]],
        ['Yesterday', [moment().subtract(1, 'days'), moment().subtract(1, 'days')]],
        ['Last 7 days', [moment().subtract(6, 'days'), moment()]],
        ['Last 30 days', [moment().subtract(29, 'days'), moment()]],
        ['This month', [moment().startOf('month'), moment().endOf('month')]],
        ['Last month', [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]]
      ]
      ranges = _.object(_.filter(ranges, function (rangeArray) {
        var range = rangeArray[1]
        var start = range[0]
        var end = range[1]
        return start.diff(siteCreatedAt) > 0 && end.diff(siteCreatedAt)
      }))

      return {
        minDate: createdAt,
        maxDate: moment().endOf('day'),
        display: 'Last 30 days',
        range: {
          startDate: startDate,
          endDate: moment().endOf('day')
        },
        options: {
          /* dateLimit: {
            days: 60
          },*/
          showDropdowns: true,
          ranges: ranges,
          buttonClasses: ['btn'],
          applyClass: 'apply-btn',
          cancelClass: 'cancel-btn',
          opens: 'right',
          separator: ' to ',
          format: 'MM/DD/YYYY',
          locale: {
            applyLabel: 'Show',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom Range',
            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
          }
        }
      }
    }
  })

  .factory('ValidatorService', function ($q, ApiService) {
    var config = {
      number: {
        validator: function (input) {
          return /^[0-9]*$/g.test(input.toString())
        },
        priority: 2,
        message: 'Please use numbers only.'
      },
      url: {
        validator: function (input) {
          return input.indexOf('.') > -1
        // return /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g.test(input)
        },
        priority: 1,
        message: 'Please enter valid URL.'
      },
      email: {
        validator: function (input) {
          return /^([\w-]+(?:\.[\w-]+)*)(\+[a-z0-9]+)?@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,}(?:\.[a-z]{2})?)$/g.test(input)
        },
        priority: 1,
        message: 'Please enter valid email adress.'
      },
      password: {
        validator: function (input) {
          return /^.{6,}$/g.test(input.toString())
        },
        priority: 1,
        message: 'Please use minimum 6 characters'
      },
      maxlength: {
        validator: function (input, number) {
          return input.toString().trim().length <= Number(number)
        },
        priority: 1,
        message: 'This value must be shorter.'
      },
      length: {
        validator: function (input, number) {
          return input.toString().length === Number(number)
        },
        priority: 1,
        message: 'Input length is not valid.'
      },
      phone: {
        validator: function (input) {
          return /^\+?[0-9]{10,}$/g.test(input.toString())
        },
        priority: 1,
        message: 'Please enter a valid phone number.'
      },
      required: {
        validator: function (input) {
          return input.toString().trim() !== '' && input.toString().trim() !== '[]'
        },
        priority: 3,
        message: 'This field is required.'
      },
      equals: {
        validator: function (input, reference) {
          return input === reference
        },
        priority: 1,
        message: 'The two fields must be equal.'
      },
      luhn: {
        validator: function (input) {
          // The Luhn Algorithm. It's so pretty.
          var cDigit
          var nCheck = 0
          var nDigit = 0
          var bEven = false
          var value = input.replace(/\D/g, '')

          for (var n = value.length - 1; n >= 0; n--) {
            cDigit = value.charAt(n)
            nDigit = parseInt(cDigit, 10)

            if (bEven && (nDigit *= 2) > 9) {
              nDigit -= 9
            }

            nCheck += nDigit
            bEven = !bEven
          }

          return (nCheck % 10) === 0
        },
        priority: 2,
        message: 'Invalid card number.'
      },
      duplicate: {
        validator: function (input, current) {
          if (!input) { return false }
          if (input === current) {
            return true
          }
          return ApiService

            .get('validate/email', { email: input.trim() })
            .then(function (result) {
              return result.email
            })
        },
        priority: 2,
        message: 'Please choose another email address.'
      },

      domain: {
        validator: function (input) {
          if (!input) { return false }
          return ApiService

            .get('validate/existingdomain', { domain: input.trim().replace(/^https?:\/\//gi, '') })
            .then(function (result) {
              return result.existingdomain.domain
            })
        },
        priority: 2,
        message: 'Please choose an existing domain.'
      }
    }

    return {
      isValid: function (input, validators) {
        return $q

          .all(_.map(validators, function (validator) {
            var array = validator.split('=')
            return $q.when(config[array[0]].validator(input || '', array[1]))
          }))

          .then(function (result) {
            var messages = []
            var max = 0
            var validity = _.reduce(result, function (memo, value, index) {
              var array = validators[index].split('=')
              if (!value) {
                max = Math.max(max, config[array[0]].priority)
                return value
              }

              if (_.isString(value)) { return value }
              if (_.isString(memo)) { return memo }

              return memo && value
            }, true)

            _.each(result, function (value, index) {
              var array = validators[index].split('=')
              if (!value && config[array[0]].priority >= max) {
                messages.push(config[array[0]].message)
              }
            })

            return {
              messages: messages,
              validity: validity
            }
          })
      }
    }
  })

  .factory('TimeZones', function () {
    var importantZones = [
      { value: 'Pacific/Tarawa', display: 'Tarawa' },
      { value: 'Pacific/Auckland', display: 'New Zealand Time' },
      { value: 'Pacific/Norfolk', display: 'Norfolk Island (Austl.)' },
      { value: 'Pacific/Noumea', display: 'Noumea, New Caledonia' },
      { value: 'Australia/Sydney', display: 'Australian Eastern Time (Sydney)' },
      { value: 'Australia/Queensland', display: 'Australian Eastern Time (Queensland)' },
      { value: 'Australia/Adelaide', display: 'Australian Central Time (Adelaide)' },
      { value: 'Australia/North', display: 'Australian Central Time (Northern Territory)' },
      { value: 'Asia/Tokyo', display: 'Tokyo' },
      { value: 'Australia/West', display: 'Australian Western Time' },
      { value: 'Asia/Hong_Kong', display: 'Hong Kong' },
      { value: 'Asia/Bangkok', display: 'Thailand (Bangkok)' },
      { value: 'Asia/Jakarta', display: 'Western Indonesian Time (Jakarta)' },
      { value: 'Asia/Dhaka', display: 'Bangladesh (Dhaka)' },
      { value: 'Asia/Calcutta', display: 'India' },
      { value: 'Asia/Kabul', display: 'Afghanistan (Kabul)' },
      { value: 'Asia/Tashkent', display: 'Uzbekistan (Tashkent)' },
      { value: 'Asia/Dubai', display: 'UAE (Dubai)' },
      { value: 'Europe/Moscow', display: 'Moscow' },
      { value: 'Asia/Tehran', display: 'Tehran' },
      { value: 'Africa/Djibouti', display: 'Djibouti' },
      { value: 'Europe/Minsk', display: 'Minsk' },
      { value: 'Africa/Cairo', display: 'Cairo' },
      { value: 'EET', display: 'Eastern European Time' },
      { value: 'CET', display: 'Central European Time' },
      { value: 'WET', display: 'Western European Time' },
      { value: 'Europe/Lisbon', display: 'Western European Time (Lisbon)' },
      { value: 'Europe/London', display: 'British Time (London)' },
      { value: 'GMT', display: 'Greenwich Mean Time' },
      { value: 'Iceland', display: 'Western European Time (Iceland)' },
      { value: 'America/Scoresbysund', display: 'Eastern Greenland Time' },
      { value: 'America/Sao_Paulo', display: 'Eastern Brazil' },
      { value: 'America/Godthab', display: 'Central Greenland Time' },
      { value: 'America/Thule', display: 'Western Greenland Time' },
      { value: 'Canada/Newfoundland', display: 'Newfoundland Time' },
      { value: 'America/Buenos_Aires', display: 'Buenos Aires' },
      { value: 'Atlantic/Bermuda', display: 'Atlantic Time (Bermuda)' },
      { value: 'Brazil/West', display: 'Atlantic Time' },
      { value: 'US/Eastern', display: 'Eastern Time' },
      { value: 'US/East-Indiana', display: 'Eastern Time (Indiana)' },
      { value: 'US/Central', display: 'Central Time' },
      { value: 'America/Monterrey', display: 'Central Time (Mexico City, Monterrey)' },
      { value: 'Canada/Saskatchewan', display: 'Central Time (Saskatchewan)' },
      { value: 'US/Mountain', display: 'Mountain Time' },
      { value: 'US/Arizona', display: 'Mountain Time (Arizona)' },
      { value: 'US/Pacific', display: 'Pacific Time' },
      { value: 'US/Alaska', display: 'Alaska Time' },
      { value: 'US/Hawaii', display: 'Hawaiian/Aleutian Time' }
    ]
    return {
      generate: function () {
        return _.map(importantZones, function (zone) {
          return {
            display: '(UTC ' + moment().tz(zone.value).format('Z') + ') ' + zone.display,
            value: zone.value
          }
        })
      },
      convert: function (timezone) {
        if (!timezone) return timezone
        var hour = moment().tz(timezone).format('HH:MM')
        var zone = _.find(importantZones, function (zone) {
          return moment().tz(zone.value).format('HH:MM') === hour
        })
        return zone.value
      }
    }
  })

  .factory('Intercom', function ($window, $q, $timeout, ApiService, ENV, log) {
    var key = ENV.intercomKey
    var data

    if (ENV.name === 'development') {
      return {
        push: function () { log.text('intercom: env is development, did not push', log.level.INFO); return this },
        update: function () { log.text('intercom: env is development, did not update', log.level.INFO); return this },
        shutdown: function () { log.text('intercom: env is development, did not shutdown', log.level.INFO); return this },
        send: function () {
          log.text('intercom: env is development, did not send', log.level.INFO)
          var deferred = $q.defer()
          $timeout(function () {
            deferred.resolve('ok')
          }, 0)
          return deferred.promise
        }
      }
    }
    return {
      push: function (message) {
        message.app_id = key
        if (!data) {
          $window.Intercom('boot', message)
        }
        $window.Intercom('update', message)
        data = message
        return this
      },
      update: function () {
        $window.Intercom('update')
        return this
      },
      send: function (type, params) {
        return ApiService.post('intercom/' + type, params)
      },
      shutdown: function () {
        data = undefined
        $window.Intercom('shutdown')
        return this
      }
    }
  })

  .factory('require', function ($document, $q) {
    return function (url) {
      var deferred = $q.defer()
      var script = $document.find("script[src*='" + url + "']")
      var head = $document.find('head') [0]
      if (!head) { deferred.reject('no head found') }
      if (script) { script.remove() }

      script = document.createElement('script')
      script.setAttribute('src', url)
      script.onload = function (event) {
        deferred.resolve(event)
      }

      head.appendChild(script)
      return deferred.promise
    }
  })

  .factory('recurly', function ($window, require, ENV) {
    return function () {
      return require('https://js.recurly.com/v4/recurly.js')
        .then(function (event) {
          if ($window.recurly) {
            $window._thirdParty = $window._thirdParty || {}
            $window._thirdParty.recurly = $window.recurly
            try { delete $window.recurly } catch (e) { $window.recurly = undefined }
          }
          var recurly = $window._thirdParty.recurly
          recurly.configure({
            publicKey: ENV.recurlyPublicKey,
            style: {
              all: {
                fontFamily: 'Lato',
                fontSize: '14px',
                fontColor: '#555'
              },
              number: {
                placeholder: '1111-2222-3333-4444'
              },
              month: {
                placeholder: 'mm'
              },
              year: {
                placeholder: 'yy'
              },
              cvv: {
                placeholder: '123'
              }
            }
          })

          return recurly
        })
    }
  })

  .factory('LeadDyno', function ($window, require, ENV) {
    var promise = require('https://static.leaddyno.com/js')
        .then(function (event) {
          var LeadDyno = $window.LeadDyno
          LeadDyno.key = '49ffff0b7a1c2e91f2ecb6272d39dce08a0e9079'
          LeadDyno.domain = 'ghostmonitor.com'
          return LeadDyno
        })
    return {
      recordLead: function (email) {
        if (ENV.name !== 'production') return
        promise.then(function (LeadDyno) {
          LeadDyno.recordVisit()
          LeadDyno.recordLead(email)
        })
      }
    }
  })

  .factory('siteInfo', function (ApiService) {
    var shopify = {}
    var info = {
      me: {},
      isNotShopify: false,
      refresh: function (user) {
        info.me = _.extend(info.me, user)
        info.isNotShopify = !(shopify.id === info.me.site.engine)
      }
    }
    ApiService.get(['me', 'siteengines'])
    .then(function (result) {
      shopify = _.find(result.siteengines, function (engine) {
        return engine.slug === 'shopify'
      })
      info.me = _.extend(info.me, result.me)
      return info.me
    })
    .then(info.refresh)

    return info
  })
