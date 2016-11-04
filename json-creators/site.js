const jsf = require('json-schema-faker')
const moment = require('moment')
var statisticsJsonModule = require('./role.js')
var plansJsonModule = require('./plans.js')

var generator = {
  create: function (siteId) {
    var account = {
      type: 'object',
      properties: {
        city: {
          'type': 'string',
          'faker': 'address.city'
        },
        zipCode: {
          'type': 'string',
          'faker': 'address.zipCode'
        },
        company: {
          'type': 'string',
          'faker': 'company.companyName'
        },
        country: {
          'type': 'string',
          enum: ['Hungary', 'USA', 'France', 'Germany']
        },
        state: {
          'type': 'string',
          'faker': 'address.state'
        },
        address: {
          'type': 'string',
          'faker': 'address.streetAddress'
        },
        industry: {
          'type': 'array'
        },
        phone: {
          'type': 'string',
          'faker': 'phone.phoneNumber'
        }
      },
      required: ['city', 'zipCode', 'company', 'country', 'state', 'address', 'industry', 'phone']
    }

    var notifications = [{
      type: 'object',
      properties: {
        email: {
          'type': 'string',
          'faker': 'internet.email'
        },
        phone: '',
        daily: {
          type: 'object',
          properties: {
            email: {
              'type': 'boolean',
              enum: [true, false]
            },
            sms: {
              'type': 'boolean',
              enum: [true, false]
            }
          },
          required: ['email', 'sms']
        },
        weekly: {
          type: 'object',
          properties: {
            email: {
              'type': 'boolean',
              enum: [true, false]
            },
            sms: {
              'type': 'boolean',
              enum: [true, false]
            }
          },
          required: ['email', 'sms']
        },
        monthly: {
          type: 'object',
          properties: {
            email: {
              'type': 'boolean',
              enum: [true, false]
            },
            sms: {
              'type': 'boolean',
              enum: [true, false]
            }
          },
          required: ['email', 'sms']
        }
      },
      required: ['email', 'phone', 'daily', 'weekly', 'monthly']
    }]

    var accountJson = jsf(account)
    var notificationsJson = jsf(notifications)
    var randCreateTime = Math.floor(Math.random() * (365 - 1)) + 1
    var randUpdateTime = randCreateTime - Math.floor(Math.random() * (100 - 1)) + 1

    var schema = {
      type: 'object',
      properties: {
        _id: siteId,
        name: {
          'type': 'string',
          'faker': 'internet.domainWord'
        },
        domain: {
          'type': 'string',
          'faker': 'internet.domainName'
        },
        trialEndsAt: moment().add(randCreateTime, 'day').format(),
        __v: 0,
        wizardFinished: {
          'type': 'boolean',
          enum: [false]
        },
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
        engine: {
          'type': 'string',
          enum: ['55ddcafcaf62a90646a9ea5b', '55ddcafcaf62a90646a9ea59']
        },
        timeZone: 'CET',
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
        notifications: notificationsJson,
        campaigns: [
          {
            enabled: true,
            _id: '56af547dbee827fedf4ae850'
          }
        ],
        statistics: statisticsJsonModule,
        discount: {
          amount: 0,
          enabled: true
        },
        emailSettings: {
          senderName: {
            'type': 'string',
            'faker': 'internet.domainWord'
          },
          senderEmail: {
            'type': 'string',
            'faker': 'internet.email'
          }
        },
        createdAt: moment().subtract(randCreateTime, 'day').format(),
        updatedAt: moment().subtract(randUpdateTime, 'day').format(),
        plan: plansJsonModule(),
        campaignItemLanguage: {
          'type': 'string',
          enum: ['561fdb74ee3e01b04d905059', '561fdb74ee3e01b04d90505a', '561fdb74ee3e01b04d90505b']
        },
        isTrackingActive: true,
        isBillingActive: {
          'type': 'string',
          enum: ['trial', 'inactive', 'active']
        },
        discounts: 'null',
        id: siteId
      },
      required: ['_id', '__v', 'name', 'trialEndsAt', 'domain', 'wizardFinished', 'startedTimeout', 'heartbeatTimeout', 'currency', 'engine', 'timeZone', 'account', 'antiSpam', 'payment', 'billing', 'notifications', 'campaigns', 'statistics', 'discount', 'emailSettings', 'createdAt', 'updatedAt', 'plan', 'campaignItemLanguage', 'isTrackingActive', 'isBillingActive', 'discounts', 'id']
    }

    var site = jsf(schema)
    return site
  }
}

module.exports = generator
