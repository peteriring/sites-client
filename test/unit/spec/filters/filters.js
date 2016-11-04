'use strict'
/* global describe, expect, it, beforeEach, inject, moment */

describe('Filters', function () {
  beforeEach(module('GMClient'))

  var filters = {}
  var $sce
  it('should inject', inject(function (
    _$sce_,
    percentFilter,
    cutFilter,
    knobFilter,
    ghostDatestringFilter,
    ghostsDurationFilter,
    campaignsMockFilter
  ) {
    filters.cut = cutFilter
    filters.percent = percentFilter
    filters.knob = knobFilter
    filters.ghostDatestring = ghostDatestringFilter
    filters.ghostsDuration = ghostsDurationFilter
    filters.campaignsMock = campaignsMockFilter
    $sce = _$sce_
  }))

  it('should (cut) exist', function () {
    expect(!!filters.cut).toBe(true)
  })

  it('should (percent) exist', function () {
    expect(!!filters.percent).toBe(true)
  })

  it('should (knob) exist', function () {
    expect(!!filters.knob).toBe(true)
  })

  it('should (ghostDatestring) exist', function () {
    expect(!!filters.ghostDatestring).toBe(true)
  })

  it('should (ghostsDuration) exist', function () {
    expect(!!filters.ghostsDuration).toBe(true)
  })

  it('should (campaignsMock) exist', function () {
    expect(!!filters.campaignsMock).toBe(true)
  })

  describe('percent', function () {
    it('should handle data well', function () {
      expect(filters.percent(false)).toBe('0%')
      expect(filters.percent(null)).toBe('0%')
      expect(filters.percent(undefined)).toBe('0%')

      expect(filters.percent(1.0)).toBe('100%')
      expect(filters.percent(0.37)).toBe('37%')
      expect(filters.percent(0.2945688)).toBe('29.46%')
    })
  })

  describe('cut', function () {
    var sample = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
      ' Etiam vulputate eget risus at ultricies. Nullam placerat vestibulum ' +
      'purus a ullamcorper. Vestibulum pharetra urna sed eros accumsan, a ' +
      'tempus magna vulputate.'

    it('should handle data well', function () {
      expect(filters.cut('sample', false, 0)).toBe('sample')
      expect(filters.cut(undefined, false, 0)).toBe('')
      expect(filters.cut(1231231231, false, 1231231231, '')).toBe('1231231231')

      expect(filters.cut(sample, false, 9).length > 9).toBe(true)
      expect(filters.cut(sample, false, 9)).toBe('Lorem ips…')
      expect(filters.cut(sample, false, 9.3123)).toBe('Lorem ips…')
      expect(filters.cut(sample, true, 8)).toBe('Lorem…')
      expect(filters.cut(sample, false, 9, '. volt')).toBe('Lorem ips. volt')
    })
  })

  describe('knob', function () {
    it('should handle data well', function () {
      expect(filters.knob(123)).toBe(100)
      expect(filters.knob(1.23)).toBe(100)
      expect(filters.knob(false)).toBe(0)
      expect(filters.knob('123')).toBe(100)
      expect(filters.knob('asda') || 0).toBe(0)

      expect(filters.knob(0.7887)).toBe(78)
      expect(filters.knob(0.2302)).toBe(23)
    })
  })

  describe('ghostDatestring', function () {
    var now = moment()
    var past = now.clone().subtract(7, 'days')
    var input = past.toISOString()
    var result = past.from(now)

    it('should handle data well', function () {
      expect(filters.ghostDatestring('invalid')).toBe('Invalid date')

      expect(filters.ghostDatestring(input)).toBe(result)
    })
  })

  describe('ghostsDuration', function () {
    it('should handle data well', function () {
      expect(filters.ghostsDuration(1000)).toBe('1s')
      expect(filters.ghostsDuration(100000)).toBe('1m40s')
      expect(filters.ghostsDuration(6000000)).toBe('1h40m0s')
      expect(filters.ghostsDuration(144000000)).toBe('1d16h0m0s')
      expect(filters.ghostsDuration(604799999)).toBe('6d23h59m59s')

      expect(filters.ghostsDuration(604800000)).toBe('more than a week')
      expect(filters.ghostsDuration(999)).toBe('')
    })
  })

  describe('campaignsMock', function () {
    var sample = '<div>{{example1}} {{example2.example3}}</div>'
    var site = {
      example1: 'amala',
      example2: {
        example3: 'hamala'
      }
    }
    it('should handle data well', function () {
      expect($sce.getTrustedHtml(filters.campaignsMock(sample, site))).toBe('<div>amala hamala</div>')
    })
  })
})
