'use strict'
/* global Sass, _ */

angular.module('GMClient')

  .controller('EditorController', function ($scope, $compile, $element, $q, $timeout, TemplateFactory, ApiService, DelayedCallback, log, data, $templateRequest, $http) {
    var sass = new Sass()
    var raw = {}
    raw.template = ''
    raw.style = ''

    $scope.compiled = ''

    $scope.setUp = function (template, style, schema, variances) {
      raw.template = TemplateFactory(template)
      raw.style = TemplateFactory(style)
      $scope.schema = schema
      _.each(_.keys($scope.schema), function (key) {
        delete $scope.schema[key]._id
        delete $scope.schema[key].id
      })
      $scope.templateVariances = variances.templateVariances || $scope.templateVariances
      $scope.resetVariances = variances.resetVariances || $scope.resetVariances
      $scope.saveVariances = variances.saveVariances || $scope.saveVariances

      if (!variances.staticStyle) return $scope.assemble()
      _.each($scope.schema.design, function (object, name) {
        variances.staticStyle = variances.staticStyle.replace('@@' + name, object.value)
      })
      sass.compile(variances.staticStyle, function (style) {
        if (!style.text) {
          return log.text(JSON.stringify(style), log.level.ERROR)
        }
        raw.staticStyle = style.text
        $scope.assemble()
      })
    }

    $scope.assemble = function (callback) {
      if (!raw.style || !raw.template || !$scope.schema) {
        return
      }
      _.each($scope.schema.design, function (object, name) {
        raw.style.replace('@@' + name, object.value)
      })

      sass.compile(raw.style.get(), function (style) {
        if (!style.text) {
          return log.text(JSON.stringify(style), log.level.ERROR)
        }
        var css = style.text
        css = (raw.staticStyle || '') + css
        raw.template.replace('<!-- inlinestyle -->', '<style type="text/css">' + css + '</style>')
        // raw.template.replace('@@logo', $scope.schema.image.logo.value)
        $scope.compiled = $scope.templateVariances(raw)
        if (!$scope.$$phase) { $scope.$apply() }
        $scope.recompile()
        return (typeof callback === 'function') ? callback() : null
      })
    }

    $scope.delay = function (callback) {
      DelayedCallback($scope, callback)
    }

    $scope.recompile = function () {
      var iframe = $element.find('iframe')
      $compile(iframe.contents())($scope)
      iframe.contents().find('form').submit(function (event) {
        event.preventDefault()
        return false
      })
      if (iframe.attr('still')) return
      iframe.height(iframe.contents().find('html').height())
      iframe.width(iframe.contents().find('table').width() + 10)
    }

    $scope.reset = function () {
      var reset = function (obj) {
        _.each(obj, function (item, name) {
          if (name === '_id' || name === 'id') return
          item.value = item.default ? item.default : item.value
        })
      }
      reset($scope.schema.image)
      reset($scope.schema.text)
      reset($scope.schema.design)
      reset($scope.schema.variables)

      $scope.assemble()

      return $scope.resetVariances($scope.schema)
        .then(function () {
          log.ui('email changes reset', log.level.SUCCESS)
        })
        .catch(function () {
          log.ui('email changes reset failed', log.level.ERROR)
        })
    }

    $scope.save = function ($event) {
      var colorRegexp = /^#[0-9a-f]{6}$/
      var button = $element.find($event.currentTarget)
      var span = button.find('span')
      var pluck = function (array, regexp) {
        return _.chain(array)
          .omit(function (elem, name) {
            if (name === '_id' || name === 'id') return true
            var match = regexp ? !elem.value.match(regexp) : false
            var trimmed = _.isString(elem.value) ? !elem.value.trim() : false
            return trimmed || elem.value === elem.default || match
          // return !elem.value.trim()
          })
          .mapObject(function (elem) {
            return elem.value
          })
          .value()
      }
      button.prop('disabled', true)
      span.addClass('faa-passing animated')

      var changes = {
        design: pluck($scope.schema.design, colorRegexp),
        text: pluck($scope.schema.text),
        image: pluck($scope.schema.image),
        variables: pluck($scope.schema.variables)
      }

      return $scope.saveVariances(changes)
        .then(function () {
          log.ui('email changes saved', log.level.SUCCESS)
        })
        .catch(function () {
          log.ui('email changes saving failed', log.level.ERROR)
        })
        .finally(function () {
          button.prop('disabled', false)
          span.removeClass('faa-passing animated')
        })
    }

    $scope.templateVariances = function (raw) {
      // this is a parent function, should be redefined
      return raw.template.get()
    }

    $scope.resetVariances = function (schema) {
      // this is a parent function, should be redefined (should return a promise)
      return $q(function (resolve, reject) { $timeout(function () { resolve(schema) }, 1000) })
    }

    $scope.saveVariances = function (changes) {
      // this is a parent function, should be redefined (should return a promise)
      return $q(function (resolve, reject) { $timeout(function () { resolve(changes) }, 1000) })
    }
  })
