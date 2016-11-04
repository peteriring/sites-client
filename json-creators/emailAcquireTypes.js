const jsf = require('json-schema-faker')
const fs = require('fs')

module.exports = function () {
  var refs = [
    {
      'id': 'max1000',
      'type': 'integer',
      'minimum': 0,
      'maximum': 1000
    },
    {
      'id': 'rate',
      'type': 'integer',
      'enum': ['0.237', '0.534', '0.412', '0.61', '0.34', '0.19', '0.453', '0.134', '0.86']
    }
  ]

  var schema = {
    'pre': {
      $ref: 'max1000'
    },
    'submit': {
      $ref: 'max1000'
    },
    'login': {
      $ref: 'max1000'
    },
    'atc': {
      $ref: 'max1000'
    },
    'pre_submit': {
      $ref: 'max1000'
    },
    'conversionRate': {
      $ref: 'rate'
    }
  }

  var emailAcquireTypes = jsf(schema, refs)
  fs.writeFileSync('./app/mockapi/json/emailAcquireTypes.json', JSON.stringify(emailAcquireTypes, null, 4))
}
