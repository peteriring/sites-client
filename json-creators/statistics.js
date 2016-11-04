const jsf = require('json-schema-faker')
const fs = require('fs')

var generator = {
  createStatistic: function (siteId) {
    var refs = [
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
      site: {
        _id: siteId,
        statistics: {
          type: 'object',
          properties: {
            range: {
              'type': 'integer',
              'minimum': 1,
              'maximum': 10
            },
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
            recoveredRevenue: {
              $ref: 'max100000'
            },
            shopRevenueWithoutGM: {
              $ref: 'max100000'
            },
            shopRevenueWithGM: {
              $ref: 'max100000'
            },
            checkoutsStarted: {
              $ref: 'max1000'
            },
            abandonedCarts: {
              $ref: 'max1000'
            },
            recoveredCarts: {
              $ref: 'max1000'
            },
            lostRevenue: {
              $ref: 'max100000'
            },
            abandonedCartsWithEmail: {
              $ref: 'max1000'
            },
            startedCheckout: {
              $ref: 'max1000'
            },
            clickRate: {
              $ref: 'rate'
            },
            openRate: {
              $ref: 'rate'
            },
            bounceRate: {
              $ref: 'rate'
            },
            abandonmentRate: {
              $ref: 'rate'
            },
            conversionRate: {
              $ref: 'rate'
            },
            identifiableRate: {
              $ref: 'rate'
            },
            conversionCount: {
              $ref: 'max1000'
            },
            revenueGrowth: {
              $ref: 'rate'
            }
          },
          required: ['range', 'lostRevenue', 'conversionRate', 'sentEmails', 'clickCount', 'openCount', 'bounceCount', 'recoveredRevenue', 'shopRevenueWithoutGM',
            'shopRevenueWithGM', 'startedCheckout', 'checkoutsStarted', 'abandonedCarts', 'abandonedCartsWithEmail', 'recoveredCarts', 'refId', 'clickRate', 'openRate',
            'bounceRate', 'identifiableRate', 'abandonmentRate', 'conversionCount', 'revenueGrowth']
        }
      },
      campaigns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            items: [
              {
                _id: '56af5780bee827fedf4ae853',
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
                _id: '56af57b0bee827fedf4ae855',
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
                _id: '56af57d9bee827fedf4ae857',
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
                _id: '56af57ffbee827fedf4ae859',
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
            }
          },
          required: ['items', 'statistics']
        },
        minItems: 1,
        maxItems: 1
      }
    }

    var statistic = jsf(schema, refs)
    return statistic
  },

  create: function (siteId) {
    var statistics = []
    for (var i = 0; i < 8; i++) {
      statistics[i] = generator.createStatistic(siteId)
    }
    fs.writeFileSync('./app/mockapi/json/statistics.json', JSON.stringify(statistics, null, 4))
  }
}

module.exports = generator
