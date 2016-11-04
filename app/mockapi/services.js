'use strict'
/* global ForerunnerDB, _ */

angular.module('GMClient')

  .factory('forerunnerDB', function ($http, $q, ENV) {
    if (ENV.apiEndpoint) { return {} }

    var forerunnerDB = new ForerunnerDB()
    var mockDb = forerunnerDB.db('mockDb')
    var config = {
      'jsonPath': 'mockapi/json/'
    }

    var collectionNames = [
      'me',
      'users',
      'campaigns',
      'ghosts',
      'country',
      'statistics',
      'diagramLast7',
      'diagramLast30',
      'diagramLastMonth',
      'diagramThisMonth',
      'diagramToday',
      'diagramYesterday',
      'plans',
      'siteengines',
      'emailSchema1',
      'emailSchema2',
      'emailSchema3',
      'register',
      'campaignitemlanguages',
      'currencies',
      'finished',
      'emailAcquireTypes',
      'schemaAtc',
      'item'
    ]

    return {
      db: mockDb,
      generateLocalDB: function () {
        var promises = _.map(collectionNames, function (collectionName) {
          var jsonUrl = config.jsonPath + collectionName + '.json'
          return $http.get(jsonUrl).then(function (result) {
            var collection = mockDb.collection(collectionName)
            collection.insert(result.data)
            return true
          })
        })
        return $q.all(promises)
      }
    }
  })

  .factory('ParamService', function () {
    return {
      match: function (url) {
        var query = url.split('?')[1]
        var match
        var params = {}

        // replace addition symbol with a space
        var pl = /\&/g

        // delimit params
        var search = /([^&=]+)=?([^&]*)/g
        var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')) }
        while ((match = search.exec(query))) {
          params[decode(match[1])] = decode(match[2])
        }
        return params
      }
    }
  })
