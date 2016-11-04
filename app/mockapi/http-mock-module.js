'use strict'
/* global _ */

  /* *****************
      DELAY - for testing animation of waiting
    ***************** */
// .config(function ($provide) {
//   $provide.decorator('$httpBackend', function ($delegate) {
//     var proxy = function (method, url, data, callback, headers) {
//       var timer = 0
//       if (url.match(/falseme\/statistics/) || url.match(/falseme\/campaigns/)) {
//         timer = Math.random() * 2000 + 100
//       }
//       var interceptor = function () {
//         var _this = this
//         var _arguments = arguments
//         setTimeout(function () {
//           callback.apply(_this, _arguments)
//         }, timer)
//       }
//       return $delegate.call(this, method, url, data, interceptor, headers)
//     }
//     for (var key in $delegate) {
//       proxy[key] = $delegate[key]
//     }
//     return proxy
//   })
// })

angular.module('GMClient')

  .run(function ($httpBackend, $auth, ENV, forerunnerDB, log, ParamService) {
    var regexp = /.*/
    var methods = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'PATCH', 'JSONP']
    if (ENV.apiEndpoint) {
      return _.each(methods, function (method) {
        $httpBackend['when' + method](regexp).passThrough()
      })
    }

    var db = forerunnerDB.db
    forerunnerDB.generateLocalDB()

    $httpBackend.whenPOST(ENV.apiEndpoint + 'auth/process').respond(function (method, url, dataString) {
      log.text('mock: ' + url, log.level.DEBUG)

      var data = JSON.parse(dataString)
      var httpCode = 400
      var response = {
        'status': 400,
        'msg': 'Unknown user ' + data.email
      }

      var user = db.collection('users').find({
        user: {
          email: {
            '$eq': data.email
          }
        }
      })

      if (user.length) {
        httpCode = 200
        response = user[0]
      }

      return [httpCode, response, {}]
    })

    /* *****************
      ME
    ***************** */
    $httpBackend.whenGET(ENV.apiEndpoint + 'me').respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)

      var user = db.collection('users').find({
        token: {
          '$eq': $auth.getToken()
        }
      })

      // if (user[0]) {
      var site = db.collection('me').find({
        site: {
          id: {
            '$eq': user[0].user.site
          }
        }
      })

      var response = site[0]
      return [200, response, {}]
    // }
    // return [404, 'Not Found', {}]
    })

    /* *****************
      CAMPAIGNS
    ***************** */
    $httpBackend.whenGET(ENV.apiEndpoint + 'me/campaigns').respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('campaigns').find()[0]
      return [200, response, {}]
    })

    $httpBackend.whenPUT(/me\/switch\/campaign/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = 'OK'
      return [200, response, {}]
    })

    $httpBackend.whenGET(/me\/sendTestEmails\?email=(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = 'OK'
      return [200, response, {}]
    })

    $httpBackend.whenGET(/me\/editor\/preview\?item=(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('item').find()[0]
      console.log(response)
      return [200, response, {}]
    })

    /* *****************
      GHOSTS
    ***************** */
    $httpBackend.whenGET(/me\/ghosts/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var params = ParamService.match(url)
      var page = 0

      if (params.limit) {
        var countPerPage = params.limit
        page = params.skip / countPerPage
      }

      var response = db.collection('ghosts').find()[page]
      return [200, response, {}]
    })

    /* *****************
      STATISTICS
    ***************** */
    $httpBackend.whenGET(ENV.apiEndpoint + 'me/statistics').respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('statistics').find()[0]
      return [200, response, {}]
    })

    $httpBackend.whenGET(/me\/statistics\?ref=(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var ref = ParamService.match(url)
      var stat = db.collection('statistics').find({
        refId: ref.ref
      })
      var response = stat[0]
      return [200, response, {}]
    })

    $httpBackend.whenGET(/me\/statistics\?end=(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var randTable = Math.floor(Math.random() * (7 - 1) + 1)
      var response = db.collection('statistics').find()[randTable]
      return [200, response, {}]
    })

    /* *****************
      DIAGRAM
    ***************** */
    $httpBackend.whenGET(ENV.apiEndpoint + 'me/diagram').respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('diagramLast30').find()[0]
      return [200, response, {}]
    })

    $httpBackend.whenGET(/me\/diagram\?end=(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)

      var diagrams = [
        db.collection('diagramLast7').find()[0],
        db.collection('diagramLast30').find()[0],
        db.collection('diagramLastMonth').find()[0],
        db.collection('diagramThisMonth').find()[0],
        db.collection('diagramToday').find()[0],
        db.collection('diagramYesterday').find()[0]
      ]
      var randTable = Math.floor(Math.random() * (5 - 0)) + 0
      var response = diagrams[randTable]
      return [200, response, {}]
    })

    /* *****************
      PLANS
    ***************** */
    $httpBackend.whenGET(ENV.apiEndpoint + 'plans').respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('plans').find()
      return [200, response, {}]
    })

    /* *****************
      COUNTRIES
    ***************** */
    $httpBackend.whenGET(/countries/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('country').find()
      return [200, response, {}]
    })

    /* *****************
      SITEENGINES
    ***************** */
    $httpBackend.whenGET(ENV.apiEndpoint + 'siteengines').respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('siteengines').find()
      return [200, response, {}]
    })

    /* *****************
      REGISTER / SIGNUP
    ***************** */
    $httpBackend.whenGET(/validate\/email\?email=(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = {}
      return [200, response, {}]
    })

    $httpBackend.whenGET(/validate\/existingdomain\?domain=(.*)/).respond(function (method, url, data, headers, params) {
      log.text('mock: ' + url, log.level.DEBUG)

      var response = {
        'domain': 'valid.hu'
      }
      return [200, response, {}]
    })

    $httpBackend.whenPOST(/auth\/register/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('register').find()[0]
      return [200, response, {}]
    })

    $httpBackend.whenGET(ENV.apiEndpoint + 'campaignitemlanguages').respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('campaignitemlanguages').find()
      return [200, response, {}]
    })

    $httpBackend.whenPOST(ENV.apiEndpoint + 'auth/finish').respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      db.collection('me').update({
        site: {
          '$ne': $auth.getToken()
        }
      }, {
        site: {
          wizardFinished: true
        }
      })

      db.collection('users').update({
        token: {
          '$eq': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
        }
      }, {
        token: 'fg4435h6h234t3tg3g'
      })
      $auth.setToken('fg4435h6h234t3tg3g')

      var response = db.collection('finished').find()
      return [200, response, {}]
    })

    /* *****************
        Settings
      ***************** */
    $httpBackend.whenPUT(/me\/update/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('users').find()[0]
      return [200, response, {}]
    })

    /* *****************
        Plugins
      ***************** */
    $httpBackend.whenPOST(/me\/plugin/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = 'OK'
      return [200, response, {}]
    })

    /* *****************
        Email
      ***************** */
    $httpBackend.whenPUT(/me\/email\/schema/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = 'OK'
      return [200, response, {}]
    })

    /* *****************
        Email Acquisition
      ***************** */
    $httpBackend.whenGET(/me\/editor\/schema\?campaign(.*)&item=56af5780bee827fedf4ae853(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('emailSchema1').find()[0]
      return [200, response, {}]
    })

    $httpBackend.whenGET(/me\/editor\/schema\?campaign(.*)&item=56af57b0bee827fedf4ae855(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('emailSchema2').find()[0]
      return [200, response, {}]
    })

    $httpBackend.whenGET(/me\/editor\/schema\?campaign(.*)&item=56af57d9bee827fedf4ae857(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('emailSchema3').find()[0]
      return [200, response, {}]
    })

    $httpBackend.whenGET(/me\/editor\/schema\?slug=(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('schemaAtc').find()[0]
      return [200, response, {}]
    })

    $httpBackend.whenPUT(/me\/editor\/schema/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = 'OK'
      return [200, response, {}]
    })

    $httpBackend.whenGET(/emailAcquireTypes\?end=(.*)/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('emailAcquireTypes').find()[0]
      return [200, response, {}]
    })

    $httpBackend.whenPUT(/falseme\/switch\/item/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('item').find()[0]

      if (response.isEnabled === true) {
        db.collection('item').update({
          isEnabled: {
            '$eq': true
          }
        }, {
          isEnabled: false
        })
      } else {
        db.collection('item').update({
          isEnabled: {
            '$eq': false
          }
        }, {
          isEnabled: true
        })
      }
      return [200, response, {}]
    })

    /* *****************
        Currencies
      ***************** */
    $httpBackend.whenGET(ENV.apiEndpoint + 'currencies').respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = db.collection('currencies').find()
      return [200, response, {}]
    })

    /* *****************
        Reset Password
      ***************** */
    $httpBackend.whenPOST(/validate\/resetpassword/).respond(function (method, url, data) {
      log.text('mock: ' + url, log.level.DEBUG)
      var response = 'OK'
      return [200, response, {}]
    })

    $httpBackend.whenGET(/(.*\.html|json|css)$/i).passThrough()
  })
