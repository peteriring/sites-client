const jsf = require('json-schema-faker')
const moment = require('moment')
const fs = require('fs')

var refs = [
  {
    'id': 'value',
    'type': 'integer',
    'minimum': 1,
    'maximum': 99999
  },
  {
    'id': 'qty',
    'type': 'integer',
    'minimum': 1,
    'maximum': 100
  }
]

var generator = {
  createGhost: function (siteId, n) {
    if (n % 7 === 0) {
      var name = 'name'
    } else {
      name = ''
    }

    var schema = {
      type: 'object',
      properties: {
        name: {
          'type': 'string',
          'faker': 'name.firstName'
        },
        site: siteId,
        ghost: ' ',
        isArActive: {
          'type': 'boolean'
        },
        sessionType: {
          enum: ['ghost', 'customer_ghost']
        },
        fields: {
          checkout: {
            billing_email: {
              'type': 'string',
              'faker': 'internet.email'
            }
          }
        },
        cartData: {
          value: {
            $ref: 'value'
          },
          itemCount: {
            $ref: 'qty'
          },
          returnUrl: {
            'type': 'string',
            'faker': 'internet.url'
          }
        },
        cartItems: [
          {
            type: 'object',
            properties: {
              qtyPrice: {
                $ref: 'value'
              },
              imageUrl: 'http://www.stuff.co.nz/etc/designs/ffx/nz/stuff/social-media-logos/stuff-180x180.jpg',
              price: {
                'type': 'integer',
                'minimum': 99999,
                'maximum': 9999999
              },
              name: {
                'type': 'string'
              },
              qty: {
                $ref: 'qty'
              },
              productId: {
                'type': 'integer',
                'minimum': 1,
                'maximum': 150
              }
            },
            required: ['qtyPrice', 'imageUrl', 'price', 'name', 'qty', 'productId']
          }
        ],
        startedAt: moment().subtract(Math.floor(Math.random() * (365 - 1)) + 1, 'day').format(),
        lastHeartbeatAt: moment().subtract(Math.floor(Math.random() * (365 - 1)) + 1, 'day').format(),
        cartStartedAt: moment().subtract(Math.floor(Math.random() * (365 - 1)) + 1, 'day').format(),
        convertedAt: moment().subtract(Math.floor(Math.random() * (365 - 1)) + 1, 'day').format(),
        createdAt: moment().subtract(Math.floor(Math.random() * (365 - 1)) + 1, 'day').format(),
        updatedAt: moment().subtract(Math.floor(Math.random() * (365 - 1)) + 1, 'day').format(),
        email: {
          'id': 'email',
          'type': 'string',
          'faker': 'internet.email'
        },
        phone: {
          'type': 'string',
          'pattern': '^[0-6]{2}-[0-7]{2}-[0-9]{7}$'
        },
        converterItem: 'null',
        id: {
          'type': 'string',
          'pattern': '[0-9A-Fa-f]+'
        }
      },
      required: ['site', name, 'ghost', 'isArActive', 'sessionType', 'fields', 'cartData', 'cartItems', 'startedAt', 'lastHeartbeatAt',
        'cartStartedAt', 'convertedAt', 'createdAt', 'updatedAt', 'email', 'phone', 'converterItem', 'id']
    }
    var ghost = jsf(schema, refs)
    return ghost
  },

  create: function (siteId, numOfGhosts, limit) {
    var ghosts = []
    var ghostsJsonArray = []
    var remaining = numOfGhosts

    for (var i = 0; i < Math.ceil(numOfGhosts / limit); i++) {
      ghosts = []
      for (var j = 0; j < limit; j++) {
        if (remaining > 0) {
          ghosts[j] = generator.createGhost(siteId, j)
          remaining--
        }
      }
      var schema = {
        type: 'object',
        properties: {
          total: numOfGhosts,
          ghosts: ghosts
        },
        required: ['total', 'ghosts']
      }
      var ghostsJsonPage = jsf(schema)
      ghostsJsonArray[i] = ghostsJsonPage
    }
    fs.writeFileSync('./app/mockapi/json/ghosts.json', JSON.stringify(ghostsJsonArray, null, 4))

    return ghostsJsonArray
  }
}

module.exports = generator
