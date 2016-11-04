const jsf = require('json-schema-faker')
const fs = require('fs')

module.exports = function () {
  var refs = [
    {
      'id': 'enum',
      'type': 'object',
      enum: [{
        '_id': '55ddcafbaf62a90646a9ea57',
        'name': 'beta_subscription',
        'slug': 'Beta subscription',
        'description': "It's a free subscription",
        'comission': '0',
        'subscriptionFee': 0,
        'features': [],
        'updatedAt': '2015-11-20T14:59:01.325Z',
        'id': '55ddcafbaf62a90646a9ea57'
      },
        {
          '_id': '55ddcafbaf62a90646a9ea58',
          'name': 'premium_subscription',
          'slug': 'Premium subscription',
          'description': "It's a cool subscription for cool guys",
          'comission': '0',
          'subscriptionFee': '0',
          'features': [
            'editCampaignItem',
            'lockCampaignItem'
          ],
          'id': '55ddcafbaf62a90646a9ea58'
        },
        {
          '_id': '564f2f2abb95f60900b8de58',
          'name': 'pro_subscription',
          'slug': 'Pro Subscription',
          'description': '30 day free trial then $10\/month.',
          'comission': 0,
          'subscriptionFee': 0,
          'features': [],
          'commission': 0,
          'createdAt': '2015-11-20T14:33:14.341Z',
          'updatedAt': '2016-01-18T22:22:33.178Z',
          'id': '564f2f2abb95f60900b8de58'
        }]
    }
  ]

  var schema = {
    $ref: 'enum'
  }

  fs.writeFileSync('./app/mockapi/json/plans.json', JSON.stringify(refs[0].enum, null, 4))

  var plan = jsf(schema, refs)
  return plan
}
