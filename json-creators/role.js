const jsf = require('json-schema-faker')
const moment = require('moment')

var generator = {
  create: function () {
    var randCreateTime = Math.floor(Math.random() * (365 - 1)) + 1
    var randId = Math.floor(Math.random() * (13464356222634 - 35243212123)) + 35243212123

    var role = {
      'type': 'object',
      properties: {
        _id: randId,
        name: 'admin',
        slung: 'Admin',
        description: {
          'type': 'string',
          'pattern': 'Webshop admin|Webshop user'
        },
        permissions: {
          'type': 'array',
          items: {
            'type': 'string',
            'pattern': 'editSite|editBilling|editAccount|addNotification'
          },
          'minItems': 3,
          'uniqueItems': true
        },
        createdAt: moment().subtract(randCreateTime, 'day').format(),
        id: randId
      },
      required: ['_id', 'name', 'slung', 'description', 'permissions', 'createdAt', 'id']
    }

    var roleJson = jsf(role)
    return roleJson
  }
}

module.exports = generator
