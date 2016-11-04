const jsf = require('json-schema-faker')
const moment = require('moment')
const fs = require('fs')

var generator = {
  create: function (siteId) {
    var randCreateTime = Math.floor(Math.random() * (365 - 1)) + 1
    var randUpdateTime = randCreateTime - Math.floor(Math.random() * (100 - 1)) + 1

    var refs = [
      {
        'id': 'id',
        'type': 'integer',
        'minimum': 17512345809,
        'maximum': 542351314315
      }
    ]

    var schema = {
      type: 'object',
      properties: {
        _id: {
          $ref: 'id'
        },
        updatedAt: moment().subtract(randUpdateTime, 'day').format(),
        createdAt: moment().subtract(randCreateTime, 'day').format(),
        site: siteId,
        campaignItemLanguage: '56af86a31570496f5957be55',
        campaignItem: '56af5780bee827fedf4ae853',
        isEnabled: {
          type: 'boolean'
        },
        __v: 0,
        schedule: {
          days: 0,
          hours: 0,
          minutes: 0
        },
        id: {
          $ref: 'id'
        }
      },
      required: ['id', 'updatedAt', 'createdAt', 'site', 'campaignItemLanguage', 'campaignItem', 'isEnabled', '__v', 'schedule', '_id']
    }
    var item = jsf(schema, refs)
    fs.writeFileSync('./app/mockapi/json/item.json', JSON.stringify(item, null, 4))
  }
}

module.exports = generator
