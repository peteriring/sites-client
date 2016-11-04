'use strict'
/* global _ */

angular.module('GMClient')

  .factory('MeCountryService', function ($q, ApiService) {
    var countries

    return {
      _countries: function () {
        // limit: 200
        return ApiService.get('countries')
          .then(function (result) {
            return $q.when(result.countries)
          })
      },
      countries: function () {
        if (countries) {
          return $q.when(countries)
        }

        return this._countries().then(function (data) {
          countries = _.chain(data)
            .pluck('country')
            .sortBy(function (country) {
              return !(country === 'United States' || country === 'United Kingdom' || country === 'Hungary')
            })
            .value()
          return $q.when(countries)
        })
      },
      states: function (countryName) {
        return this._countries()
          .then(function (data) {
            var states = []
            var country = _.chain(data)
              .findWhere({ country: countryName })
              .value()

            if (country) {
              states = country.states
              if (!states.length) {
                states.push(country.country)
              }
            }
            return $q.when(states)
          })
      }
    }
  })
