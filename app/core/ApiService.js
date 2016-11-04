'use strict'
/* global _ */
/**
 * @ngdoc overview
 * @name GMClient.ApiService
 * @description A service feladata a beérkező http kérések megfigyelése, kezelése, továbbítása
 */
angular.module('GMClient')
  /**
   * @variable {Array [String]} endPoints az autoloadernek megadott relatív címek
   * @variable {int} delayAfterAuto az autoloader 2 iterációja közt eltelt idő millisec-ben
   * @variable {int} delayAfterPromise az utolsó lefutott promise, és az első autoloader iteráció közti idő millisec-ben
   * @variable {boolean} cacheDisabled a beérkező adatok eltárolásának ki/bekapcsolása
   */
  .constant('ApiService.config', {
    endPoints: [],
    delayAfterAuto: null,
    delayAfterPromise: 0,
    cacheDisabled: false
  })
  .provider('ApiService', ['ApiService.config', function (config) {
    Object.defineProperties(this, {
      endPoints: {
        get: function () { return config.endPoints },
        set: function (value) { config.endPoints = value }
      },
      delayAfterAuto: {
        get: function () { return config.delayAfterAuto },
        set: function (value) { config.delayAfterAuto = value }
      },
      delayAfterPromise: {
        get: function () { return config.delayAfterPromise },
        set: function (value) { config.delayAfterPromise = value }
      },
      cacheDisabled: {
        get: function () { return config.cacheDisabled },
        set: function (value) { config.cacheDisabled = !!value }
      }
    })

    this.$get = ['ApiService.service', function (service) {
      return service
    }]
  }])
  .factory('ApiService.service', [
    '$http',
    '$q',
    '$timeout',
    '$interval',
    'log',
    'ENV',
    'ApiService.config',
    function ($http, $q, $timeout, $interval, log, ENV, config) {
      var protocolRegexp = /^https?:\/\//
      var hidden = {
        /**
         * @variable {Object} cache gyorsmemória tároló [hash(url) - adat] párok
         */
        cache: {},
        /**
         * @variable {Object} timer autoloader referenciájának eltárolása
         */
        timer: null,
        /**
         * @variable {boolean} running információ arról, hogy a service-t futtatjuk e
         */
        running: false,
        /**
         * @variable {Array [intervalPromises]} reloaders háttérben futó adatfrissítő műveletek listája
         */
        reloaders: [],
        /**
         * @variable {Array [String]} endPoints config.endPoints másolata, dinamikus kezeléshez
         */
        endPoints: _.map(config.endPoints, function (array) { return array[0] }), // config.endPoints.slice(0),

        /**
         * @ngdoc
         * @name GMClient.ApiService#send
         * @description tényleges adat lekérdezés a backend-től
         * @param {String} method put, post, vagy get
         * @param {String} endPoint lekérdezni kívánt adat relatív címe
         * @param {Object} params lekérdezéshez csatolt paraméterek objektumként
         * @param {boolean} disableCache gyorsmemóriában történő tárolás kikapcsolása
         * @param {int} delay idő millisec-ben az autoloader újraindításáig
         * @returns {httpPromise} promise a kapott válasszal
         */
        send: function (method, endPoint, params, disableCache, delay) {
          disableCache = config.cacheDisabled || disableCache
          var key = hidden.hash(endPoint, params)

          var promise = disableCache ? null : hidden.cache[key]

          if (!promise) {
            var url = endPoint.match(protocolRegexp) ? endPoint : ENV.apiEndpoint + endPoint
            promise = $http[method](url, params)
            promise.error(function () {
              delete hidden.cache[key]
            })

            if (!disableCache) {
              hidden.cache[key] = promise
            }
          }

          hidden.interrupt()
          promise.finally(function () {
            if (hidden.running) {
              hidden.start(delay)
            }
          })
          return promise
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#start
         * @description automatikus betöltő lánc, bizonyos időközönként betölt egyet a config-ban megadott végpontok közül, amennyiben nem fut más letöltés
         * @param {int} delay időeltolás a ciklus első elemének futtatásához
         */
        start: function (delay) {
          if (hidden.timer || config.cacheDisabled) {
            return
          }

          hidden.timer = $timeout(function () {
            if (!hidden.endPoints[0]) {
              return hidden.interrupt()
            }

            log.text('loading: ' + hidden.endPoints[0], log.level.DEBUG)

            hidden.send('get', hidden.endPoints[0], null, false, config.delayAfterAuto)
            hidden.endPoints.shift()
            hidden.interrupt()
          }, delay || config.delayAfterPromise)
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#interrupt
         * @description megszakítja az automata betöltési láncot
         */
        interrupt: function () {
          $timeout.cancel(hidden.timer)
          hidden.timer = null
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#autoReload
         * @description a megadott endPointokról kapott adatokat frissíti
         */
        autoReload: function () {
          _.map(config.endPoints, function (element) {
            var endPoint = element[0]
            var reloadTime = element[1]

            if (reloadTime <= 0) {
              return
            }

            hidden.reloaders.push($interval(function () {
              hidden.cache = _.omit(hidden.cache, hidden.hash(endPoint))
              hidden.send('get', endPoint, null, false)
            }, reloadTime * 1000))
          })
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#hash
         * @description a bemenő paraméterekből kódszót állít elő, melyet a cache értelmezni tud
         * @param {String} endPoint lekérdezni kívánt adat relatív címe
         * @param {Object} params lekérdezéshez csatolt paraméterek objektumként
         * @returns {String} hashelt cache cím
         */
        hash: function (endPoint, params) {
          var key = endPoint.replace(/\//g, '_')

          if (params) {
            key = key + '_' + JSON.stringify(params)
          }

          return key
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#prepare
         * @description adat lekérdezés előkészítése put, és post függvényeknél
         * @param {String} action put vagy post
         * @param {String} endPoint lekérdezni kívánt adat relatív címe
         * @param {Object} params lekérdezéshez csatolt paraméterek objektumként
         * @param {Array [String]} resetKeys gyorsmemóriából törlendő adatok listája
         * @returns {httpPromise} promise a kapott válasszal
         */
        prepare: function (action, endPoint, params, resetKeys) {
          resetKeys = resetKeys || []

          if (!_.isObject(params) && !resetKeys) {
            resetKeys = params
            params = undefined
          }

          if (!_.isArray(resetKeys)) {
            resetKeys = [resetKeys]
          }

          resetKeys = _.map(resetKeys, function (key) { return new RegExp(hidden.hash(key, false), 'g') })
          hidden.cache = _.omit(hidden.cache, function (value, key) {
            return _.find(resetKeys, function (regexp) {
              return (key.match(regexp))
            })
          })

          return hidden.send(action, endPoint, params, true)
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#aggregate
         * @description promise visszatérési értékét módosítja
         * @param {Array [String]} array promise.all() által visszaadott adattömb
         * @param {Array [String]} endPoints lekérdezett adatok címei
         * @returns {Array} hash név, majd a hozzá tartozó adat
         */
        aggregate: function (array, endPoints) {
          return _.object(_.map(_.pluck(array, 'data'), function (data, index) {
            var endPoint = endPoints[index]
            var backslash = endPoint.lastIndexOf('/')
            endPoint = backslash === -1 ? endPoint : endPoint.substr(backslash + 1)
            return [endPoint, data]
          }))
        }
      }

      var service = {
        /**
         * @ngdoc
         * @name GMClient.ApiService#nonblock
         * @description párhuzamosított adat lekérdezés a backend-től
         * @returns {httpPromise} promise a kapott válasszal
         */
        nonblock: {
          get: function () {
            if (!config.cacheDisabled) {
              service.get.apply(service, arguments)
            }
            return $q.when(true)
          }
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#get
         * @description adat lekérdezés a backend-től
         * @param {array[String]} endPoints lekérdezni kívánt adatok relatív címe, vagy regex-e
         * @param {Object} params lekérdezéshez csatolt paraméterek objektumként
         * @returns {httpPromise} promise a kapott válasszal
         */
        get: function (endPoints, params) {
          if (!_.isArray(endPoints)) {
            endPoints = [endPoints]
          }

          if (params) {
            params = { params: params }
          }

          var promises = _.map(endPoints, function (endPoint) {
            return hidden.send('get', endPoint, params, false)
          })

          return $q.all(promises).then(function (result) { return $q.when(hidden.aggregate(result, endPoints)) })
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#post
         * @description adat lekérdezés a backend-től
         * @param {String} endPoint lekérdezni kívánt adat relatív címe
         * @param {Object} params lekérdezéshez csatolt paraméterek objektumként
         * @param {Array [String]} resetKeys gyorsmemóriából törlendő adatok listája
         * @returns {httpPromise} promise a kapott válasszal
         */
        post: function (endPoint, params, resetKeys) {
          return hidden.prepare('post', endPoint, params, resetKeys)
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#put
         * @description adat lekérdezés a backend-től
         * @param {String} endPoint lekérdezni kívánt adat relatív címe
         * @param {Object} params lekérdezéshez csatolt paraméterek objektumként
         * @param {Array [String]} resetKeys gyorsmemóriából törlendő adatok listája
         * @returns {httpPromise} promise a kapott válasszal
         */
        put: function (endPoint, params, resetKeys) {
          return hidden.prepare('put', endPoint, params, resetKeys)
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#clear
         * @description kiüríti a gyorsmemóriában tárolt adatokat
         */
        clear: function () {
          hidden.cache = {}
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#start
         * @description Elkezdi az automatikus lekérdezések futtatását, a config-ban megadott intervallum alapján
         */
        start: function () {
          hidden.running = true
          hidden.start()
          hidden.autoReload()
        },

        /**
         * @ngdoc
         * @name GMClient.ApiService#stop
         * @description leállítja az automatikus betöltést, majd kiüríti a gyorsmemóriában tárolt adatokat
         */
        stop: function () {
          hidden.running = false
          _.map(hidden.reloaders, function (reloader) {
            return $interval.cancel(reloader)
          })
          hidden.interrupt()
          hidden.endPoints = _.map(config.endPoints, function (array) { return array[0] })

          service.clear()
        },

        running: function () {
          return _.reduce(_.keys(hidden.cache), function (memo, value) {
            return memo || !!(hidden.cache[value].$$state.pending)
          }, false)
        }
      }

      return service
    }
  ])
