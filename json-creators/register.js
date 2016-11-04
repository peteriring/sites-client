const jsf = require('json-schema-faker')
const moment = require('moment')
const fs = require('fs')

var generator = {
  create: function (siteId) {
    var account = {
      type: 'object',
      properties: {
        city: '',
        zipCode: '',
        company: '',
        country: '',
        state: '',
        address: '',
        industry: {
          'type': 'array'
        }
      },
      required: ['city', 'zipCode', 'company', 'country', 'state', 'address', 'industry']
    }

    var accountJson = jsf(account)
    var randCreateTime = Math.floor(Math.random() * (365 - 1)) + 1
    var randUpdateTime = randCreateTime - Math.floor(Math.random() * (100 - 1)) + 1

    var site = {
      type: 'object',
      properties: {
        __v: 0,
        _id: siteId,
        name: {
          'type': 'string',
          'faker': 'internet.domainWord'
        },
        domain: {
          'type': 'string',
          'faker': 'internet.domainName'
        },
        wizardFinished: false,
        startedTimeout: {
          'type': 'integer',
          'minimum': 0,
          'maximum': 50
        },
        heartbeatTimeout: {
          'type': 'integer',
          'minimum': 100,
          'maximum': 400
        },
        currency: {
          'type': 'string',
          enum: ['HUF', 'USD', 'AUD', 'GBP']
        },
        engine: '',
        timeZone: '',
        account: accountJson,
        antiSpam: accountJson,
        payment: {
          'cardName': '',
          'cardNumber': '',
          'expMonth': '',
          'expYear': '',
          'securityCode': ''
        },
        billing: accountJson,
        notifications: {
          type: 'array'
        },
        campaigns: [
          {
            enabled: true,
            _id: '56af547dbee827fedf4ae850'
          }
        ],
        discount: {
          amount: 0,
          enabled: false
        },
        emailSettings: {
          senderName: '',
          senderEmail: ''
        },
        createdAt: moment().subtract(randCreateTime, 'day').format(),
        updatedAt: moment().subtract(randUpdateTime, 'day').format(),
        id: siteId
      },
      required: ['__v', '_id', 'name', 'domain', 'wizardFinished', 'startedTimeout', 'heartbeatTimeout', 'currency', 'engine', 'timeZone', 'account',
        'antiSpam', 'payment', 'billing', 'notifications', 'campaigns', 'discount', 'emailSettings', 'createdAt', 'updatedAt', 'id']
    }

    var regSite = jsf(site)

    var schema = {
      type: 'object',
      properties: {
        site: regSite,
        user: {
          type: 'object',
          properties: {
            __v: 0,
            _id: 245656265432,
            site: siteId,
            role: 5675257453345,
            email: 'test@test.com',
            firstName: '',
            lastName: '',
            createdAt: '',
            updatedAt: '',
            id: 245656265432
          },
          required: ['__v', '_id', 'site', 'role', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt', 'id']
        },
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
      },
      required: ['site', 'user', 'token']
    }

    var register = jsf(schema)
    fs.writeFileSync('./app/mockapi/json/register.json', JSON.stringify(register, null, 4))
    return register
  }
}

module.exports = generator
