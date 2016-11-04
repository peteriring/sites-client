const jsf = require('json-schema-faker')
const fs = require('fs')

module.exports = function () {
  var refs = [
    {
      'id': 'max10',
      'type': 'integer',
      'minimum': 0,
      'maximum': 10
    },
    {
      'id': 'max1000',
      'type': 'integer',
      'minimum': 0,
      'maximum': 1000
    },
    {
      'id': 'max100000',
      'type': 'integer',
      'minimum': 0,
      'maximum': 100000
    },
    {
      'id': 'rate',
      'type': 'integer',
      'enum': ['0.237', '0.534', '0.412', '0.61', '0.34', '0.19', '0.453', '0.134', '0.86']
    }
  ]

  var schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        '_id': '56af547dbee827fedf4ae850',
        'name': 'Cart Recovery Campaign',
        'slug': 'checkout-abandonment',
        'description': 'The campaign is triggered by cart abandonment. It drives back your cart abandoners to complete their checkout.',
        'createdAt': '2016-02-01T13:50:02.612Z',
        'updatedAt': '2016-02-01T13:50:02.612Z',
        'id': '56af547dbee827fedf4ae850',
        'items': [
          {
            '_id': '56af5780bee827fedf4ae853',
            'slug': 'checkout-abandonment-1',
            'name': 'Email #1',
            'itemType': 'email',
            'needsDiscount': 'both',
            'campaign': '56af547dbee827fedf4ae850',
            'createdAt': '2016-02-01T13:50:02.612Z',
            'updatedAt': '2016-02-01T13:50:02.612Z',
            'id': '56af5780bee827fedf4ae853',
            'schedule': {
              'days': {
                $ref: 'max10'
              },
              'hours': {
                $ref: 'max10'
              },
              'minutes': {
                $ref: 'max10'
              }
            },
            isEnabled: {
              'type': 'boolean'
            },
            'scheduleString': 'immediately',
            statistics: {
              sentEmails: {
                $ref: 'max1000'
              },
              clickCount: {
                $ref: 'max1000'
              },
              openCount: {
                $ref: 'max1000'
              },
              bounceCount: {
                'type': 'integer',
                'minimum': 0,
                'maximum': 100
              },
              conversionCount: {
                $ref: 'rate'
              },
              clickRate: {
                $ref: 'rate'
              },
              openRate: {
                $ref: 'rate'
              },
              bounceRate: {
                $ref: 'rate'
              }
            }
          },
          {
            '_id': '56af57b0bee827fedf4ae855',
            'slug': 'checkout-abandonment-2',
            'name': 'Email #2',
            'itemType': 'email',
            'needsDiscount': 'both',
            'campaign': '56af547dbee827fedf4ae850',
            'createdAt': '2016-02-01T13:50:02.612Z',
            'updatedAt': '2016-02-01T13:50:02.612Z',
            'id': '56af57b0bee827fedf4ae855',
            'schedule': {
              'days': {
                $ref: 'max10'
              },
              'hours': {
                $ref: 'max10'
              },
              'minutes': {
                $ref: 'max10'
              }
            },
            isEnabled: {
              'type': 'boolean'
            },
            'scheduleString': 'immediately',
            statistics: {
              sentEmails: {
                $ref: 'max1000'
              },
              clickCount: {
                $ref: 'max1000'
              },
              openCount: {
                $ref: 'max1000'
              },
              bounceCount: {
                'type': 'integer',
                'minimum': 0,
                'maximum': 100
              },
              conversionCount: {
                $ref: 'rate'
              },
              clickRate: {
                $ref: 'rate'
              },
              openRate: {
                $ref: 'rate'
              },
              bounceRate: {
                $ref: 'rate'
              }
            }
          },
          {
            '_id': '56af57d9bee827fedf4ae857',
            'slug': 'checkout-abandonment-3',
            'name': 'Email #3',
            'itemType': 'email',
            'needsDiscount': 'no',
            'campaign': '56af547dbee827fedf4ae850',
            'createdAt': '2016-02-01T13:50:02.612Z',
            'updatedAt': '2016-02-01T13:50:02.612Z',
            'id': '56af57d9bee827fedf4ae857',
            'schedule': {
              'days': {
                $ref: 'max10'
              },
              'hours': {
                $ref: 'max10'
              },
              'minutes': {
                $ref: 'max10'
              }
            },
            isEnabled: {
              'type': 'boolean'
            },
            'scheduleString': 'immediately',
            statistics: {
              sentEmails: {
                $ref: 'max1000'
              },
              clickCount: {
                $ref: 'max1000'
              },
              openCount: {
                $ref: 'max1000'
              },
              bounceCount: {
                'type': 'integer',
                'minimum': 0,
                'maximum': 100
              },
              conversionCount: {
                $ref: 'rate'
              },
              clickRate: {
                $ref: 'rate'
              },
              openRate: {
                $ref: 'rate'
              },
              bounceRate: {
                $ref: 'rate'
              }
            }
          }
        ],
        statistics: {
          sentEmails: {
            $ref: 'max1000'
          },
          clickCount: {
            $ref: 'max1000'
          },
          openCount: {
            $ref: 'max1000'
          },
          bounceCount: {
            'type': 'integer',
            'minimum': 0,
            'maximum': 100
          },
          conversionCount: {
            $ref: 'rate'
          },
          clickRate: {
            $ref: 'rate'
          },
          openRate: {
            $ref: 'rate'
          },
          bounceRate: {
            $ref: 'rate'
          }
        },
        'enabled': true
      },
      required: ['_id', 'name', 'slug', 'description', 'createdAt', 'updatedAt', 'id', 'items', 'statistics', 'enabled']
    },
    maxItems: 1,
    minItems: 1
  }

  var campaigns = jsf(schema, refs)
  campaigns[0].items[0].id = campaigns[0].items[0]._id
  campaigns[0].items[1].id = campaigns[0].items[1]._id
  campaigns[0].items[2].id = campaigns[0].items[2]._id
  campaigns[0].id = campaigns[0]._id

  var campaignsArray = [campaigns]

  fs.writeFileSync('./app/mockapi/json/campaigns.json', JSON.stringify(campaignsArray, null, 4))
}
