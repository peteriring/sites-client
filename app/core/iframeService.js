'use strict'
/* global localStorage, addEventListener, attachEvent */

angular.module('GMClient')

  .directive('iframeComponent', function (log, iframeService) {
    return {
      restrict: 'E',
      scope: {
        handlers: '='
      },
      replace: true,
      template: '<iframe scrolling="no" frameborder="0" />',
      link: function (scope, elem, attrs) {
        var originalHeight = null
        var handlers = iframeService.handlers
        iframeService.addHandler('setHeight', function (message, iframe) {
          iframe.height(message.data.height + (originalHeight || 0) + 1)
        })

        elem.css('width', '100%')
          .attr('src', attrs.src).on('load', function () {
            elem[0].contentWindow.postMessage(JSON.stringify({
              type: 'setAuthToken', data: localStorage.getItem('satellizer_token')
            }), attrs.src)
          })

        var listener = function (event) {
          if (!originalHeight) originalHeight = elem.height()
          var message = JSON.parse(event.data)

          if (handlers[message.type]) return handlers[message.type](message, elem)
          log.text('handler not found for ' + message.type, log.level.ERROR)
        }

        if (window.addEventListener) addEventListener('message', listener, false)
        else attachEvent('onmessage', listener)
      }
    }
  })

  .factory('iframeService', function () {
    var handlers = {}
    return {
      addHandler: function (type, cb) {
        handlers[type] = cb
      },
      removeHandler: function (type, cb) {
        delete handlers[type]
      },
      handlers: handlers,
      getFocus: function () {
        var iframe = angular.element('iframe')
        iframe[0].contentWindow.postMessage(JSON.stringify({
          type: 'getFocus', data: {}
        }), iframe.attr('src'))
      }
    }
  })
