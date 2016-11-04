const jsf = require('json-schema-faker')
const moment = require('moment')
var randCreateTime = Math.floor(Math.random() * (365 - 1)) + 1
var randUpdateTime = randCreateTime - Math.floor(Math.random() * (100 - 1)) + 1

var generator = {
  create: function (userId) {
    var schema = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          faker: 'internet.email'
        },
        firstName: {
          type: 'string',
          faker: 'name.firstName'
        },
        lastName: {
          type: 'string',
          faker: 'name.lastName'
        },
        id: userId,
        createdAt: moment().subtract(randCreateTime, 'day').format(),
        updatedAt: moment().subtract(randUpdateTime, 'day').format()
      },
      required: ['email', 'firstName', 'lastName', 'id', 'createdAt', 'updatedAt']
    }

    var subUser = jsf(schema)
    return subUser
  }
}

module.exports = generator
