'use strict'
/* global _*/

angular.module('GMClient')

  .controller('PopupEditorController', function ($scope, $compile, $element, ENV, TemplateFactory, ApiService, DelayedCallback, log, data, $templateRequest, $http) {
    // scope functions
    // init
    var path = _.keys(data)[0]
    var itemId = data[path].id
    $scope.setUp(
      data[path].template,
      data[path].editorStyle,
      data[path].schema,
      {
        resetVariances: function (schema) {
          return ApiService.put('me/editor/schema', {item: $scope.itemId, model: 'Tue'})
        },
        saveVariances: function (changes) {
          return ApiService.put('me/editor/schema', {
            schema: changes,
            item: itemId,
            model: 'Tue'
          },
          'me/editor/' + path)
        },
        staticStyle: data[path].style
      })

    $scope.preset = function (htc, tc, btc, bbc) {
      $scope.schema.design['heading-text-color'].value = htc
      $scope.schema.design['text-color'].value = tc
      $scope.schema.design['button-text-color'].value = btc
      $scope.schema.design['button-bg-color'].value = bbc

      $scope.assemble()
    }
  })
