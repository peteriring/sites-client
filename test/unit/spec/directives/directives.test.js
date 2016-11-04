'use strict'
/* global describe, expect, it, beforeEach, inject */

describe('Directives', function () {
  beforeEach(module('GMClient'))
  var $compile
  var $rootScope
  var $q

  it('should inject', inject(function (
    _$compile_,
    _$rootScope_,
    _$q_,
    _$httpBackend_
  ) {
    $compile = _$compile_
    $rootScope = _$rootScope_
    $q = _$q_
    _$httpBackend_.when('GET', 'login/view.html')
      .respond(200, {
        status: 'success'
      })
    _$httpBackend_.when('GET', 'falseme')
      .respond(200, {
        status: 'success',
        me: {
          engine: 'something'
        }
      })
    _$httpBackend_.when('GET', 'falsesiteengines')
      .respond(200, {
        status: 'success',
        siteengines: [{
          slug: 'something'
        }]
      })
  }))

  // !törlés 'billingCreditCard'
  // 'a'
  // 'mock'
  // 'selectDateRange'
  // 'trackingChecker'
  // 'selectOnClick'
  // 'scrollTo'
  // 'parentClassificator'
  // 'gmForm'
  // 'gmInput'
  // 'text'
  // 'password'
  // 'gmSelect'
  // 'meMultipleRequired'
  // 'meOptionalRequired'

  it('should (a) not change main functionality', function () {
    var template = '<a href="' + Math.random() + '"></a>'
    var element = $compile(template)($rootScope)
    element.removeAttr('class')
    expect(element.prop('outerHTML')).toBe(template)
  })

  it('should (mock) wait for data', function () {
    var template = '<span mock="mock">{{mock}}</span>'
    var element

    $rootScope.mock = undefined
    element = $compile(template)($rootScope)
    $rootScope.$digest()
    element.children(0).removeAttr('class')
    expect(element.children(0).prop('outerHTML') === '<span>' + $rootScope.mock + '</span>').toBe(false)

    $rootScope.mock = 'mickmock'
    element = $compile(template)($rootScope)
    $rootScope.$digest()
    element.children(0).removeAttr('class')
    expect(element.children(0).prop('outerHTML') === '<span>' + $rootScope.mock + '</span>').toBe(true)
  })

  // <button date-range-picker options="picker.options" ng-model="picker.range" select-date-range="selectRange()" min="picker.minDate" max="picker.maxDate" class="btn btn-lg btn-green">
  it('should (selectDateRange) wait for data', function () {
    var template = '<button select-date-range="selectRange()"><i class="fa fa-clock-o"></i></button>'
    var before = 'fa fa-clock-o faa-spin animated'
    var after = 'fa fa-clock-o'
    var scope = {}
    var deferred
    var element
    scope.selectRange = function () {
      deferred = $q.defer()
      return deferred.promise
    }
    scope.$watch = function (model, callback) {
      callback('some string')
    }

    element = $compile(template)(scope)
    $rootScope.$digest()
    expect(element.prop('disabled')).toBe(true)
    expect(element.children(0).attr('class')).toBe(before)

    deferred.resolve('some string')
    $rootScope.$digest()
    expect(element.prop('disabled')).toBe(false)
    expect(element.children(0).attr('class')).toBe(after)
  })
})
