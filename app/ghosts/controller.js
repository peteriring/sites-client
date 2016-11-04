'use strict'
/* global _ */

angular.module('GMClient')

  .config(function ($stateProvider, ENV) {
    $stateProvider

      .state('app.ghosts', {
        url: '/ghosts',
        template: '<iframe-component src="' + ENV.ghostPageUrl + '" handlers="handlers"/>',
        controller: 'GhostsController',
        data: {
          title: 'Ghosts'
        }
      })
  })

  .controller('GhostsController', function ($scope, $q, $timeout, reactComponents, SiteConfig) {
    var isolate = $scope.$new(true)
    isolate.user = $scope.user
    new reactComponents.Daterangepicker(isolate, function (picker) {
      var deferred = $q.defer()
      var selected = _.clone(picker.range)

      var ranges = picker.options.ranges
      var preKey
      _.each(_.keys(ranges), function (key) {
        if (ranges[key][0].isSame(selected.startDate, 'day') && ranges[key][1].isSame(selected.endDate, 'day')) preKey = key
      })
      picker.display = preKey || selected.startDate.format(SiteConfig.dateFormat) + ' to ' + selected.endDate.format(SiteConfig.dateFormat)
      selected.display = picker.display

      $timeout(function () {
        var iframe = angular.element('iframe')
        iframe[0].contentWindow.postMessage(JSON.stringify({type: 'setDateRange', data: selected}), iframe.attr('src'))
        deferred.resolve(selected)
      }, 10)
      return deferred.promise
    }).appendTo(document.body)

    var iframe = angular.element('iframe')
      .on('load', function () {
        iframe[0].contentWindow.postMessage(JSON.stringify({type: 'setMyself', data: $scope.user}), iframe.attr('src'))
      })
  })

