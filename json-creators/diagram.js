const jsf = require('json-schema-faker')
const moment = require('moment')
const fs = require('fs')

var generator = {
  create: function (siteId, range) {
    var startTime, endTime

    switch (range) {
      case 'Today':
        startTime = moment().subtract(1, 'days').format()
        endTime = moment().format()
        break
      case 'Yesterday':
        startTime = moment().subtract(2, 'days').format()
        endTime = moment().subtract(1, 'days').format()
        break
      case 'Last7':
        startTime = moment().subtract(7, 'days').format()
        endTime = moment().format()
        break
      case 'Last30':
        startTime = moment().subtract(30, 'days').format()
        endTime = moment().format()
        break
      case 'ThisMonth':
        startTime = moment().startOf('month').format()
        endTime = moment().endOf('month').format()
        break
      case 'LastMonth':
        startTime = moment().subtract(30, 'days').startOf('month').format()
        endTime = moment().subtract(30, 'days').endOf('month').format()
        break
    }

    jsf.extend('faker', function (faker) {
      faker.custom = {
        amount: function (stamps, length) {
          var recovered = []

          for (var i = 0; i < stamps.length; i++) {
            var amount = []
            amount[0] = stamps[i]
            amount[1] = faker.random.number(length)

            recovered[i] = amount
          }
          return recovered
        }
      }
      return faker
    })

    var monthLength = moment().subtract(30, 'days').endOf('month').get('date')
    var day = moment().get('date')
    var stampArray = this.timeStamp(range, monthLength, day)

    var data = {
      type: 'object',
      properties: {
        recoveredRevenue: {
          type: 'string',
          faker: {
            'custom.amount': [stampArray, 10000]
          }
        },
        sentEmails: {
          type: 'string',
          faker: {
            'custom.amount': [stampArray, 100]
          }
        }
      },
      required: ['recoveredRevenue', 'sentEmails']
    }

    var dataJson = jsf(data)
    var siteIdObject = {}

    siteIdObject[siteId] = dataJson

    var schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          site: siteId,
          type: {
            'type': 'string',
            'pattern': 'sites'
          },
          labels: [
            'recoveredRevenue',
            'sentEmails'
          ],
          start: startTime,
          end: endTime,
          data: siteIdObject
        },
        required: ['site', 'type', 'labels', 'start', 'end', 'data']
      },
      minItems: 1,
      maxItems: 1
    }

    var diagram = jsf(schema)
    fs.writeFileSync('./app/mockapi/json/diagram' + range + '.json', JSON.stringify(diagram, null, 4))
    return diagram
  },

  timeStamp: function (range, monthLength, day) {
    var stamps = []
    var num, sub

    switch (range) {
      case 'Today':
        num = 1
        sub = 0
        break
      case 'Yesterday':
        num = 1
        sub = 1
        break
      case 'Last7':
        num = 7
        sub = 0
        break
      case 'Last30':
        num = 30
        sub = 0
        break
      case 'ThisMonth':
        num = day
        sub = 0
        break
      case 'LastMonth':
        num = monthLength
        sub = day
        break
    }

    for (var i = 0; i < num; i++) {
      var timestamp = new Date(moment().subtract(i + sub, 'days').format()).getTime() / 1000
      var timeInt = parseInt(timestamp, 10)

      stamps[num - i - 1] = timeInt
    }

    return stamps
  }
}

module.exports = generator
