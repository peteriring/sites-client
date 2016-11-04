const fs = require('fs')

module.exports = function () {
  var roleJsonModule = require('./role.js')
  var subUserModule = require('./userSubDetails.js')
  var userJsonModule = require('./users.js')
  var siteJsonModule = require('./site.js')
  var registerJsonModule = require('./register.js')
  var statisticsJsonModule = require('./statistics.js')
  var diagramJsonModule = require('./diagram.js')
  var ghostsJsonModule = require('./ghosts.js')
  var meJsonModule = require('./me.js')
  var campLangModule = require('./campaignItemLanguages.js')
  var campModule = require('./campaigns.js')
  var countriesModule = require('./countries.js')
  var emailModule = require('./emailSchema.js')
  var enginesModule = require('./siteEngines.js')
  var currencies = require('./currencies.js')
  var emailAcquireTypes = require('./emailAcquireTypes.js')
  var schemaAtc = require('./schemaAtc.js')
  var itemModule = require('./item.js')

  if (!fs.existsSync('./app/mockapi/json')) {
    fs.mkdirSync('./app/mockapi/json')
  }

  var role = roleJsonModule.create()

  /* *****************
     User json creator
     Takes user ID as parameter (must be a number)
  ***************** */

  var subUser = subUserModule.create(34525534245)

  /* *****************
     Site json creator
     Takes site ID as parameter (must be a number)
  ***************** */

  var site = siteJsonModule.create(75476354724857)
  registerJsonModule.create(site.id)

  /* *****************
     User json creator
     Secund parameter: role object
     Fourth parameter: token of user !!fix for now!!
  ***************** */

  userJsonModule.create(site.id, role, subUser, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9')
  statisticsJsonModule.create(site.id)

  /* *****************
     Diagram json creator
     Secund parameter: range value from the list ['today', 'yesterday', 'last7', 'last30', 'thisMounth', 'lastMounth']
  ***************** */

  diagramJsonModule.create(site.id, 'Today')
  diagramJsonModule.create(site.id, 'Yesterday')
  diagramJsonModule.create(site.id, 'Last7')
  diagramJsonModule.create(site.id, 'Last30')
  diagramJsonModule.create(site.id, 'ThisMonth')
  diagramJsonModule.create(site.id, 'LastMonth')

  /* *****************
     Ghosts json creator
     Secund parameter: Number of ghosts
     Third parameter: Limit of ghosts number/page
  ***************** */

  ghostsJsonModule.create(site.id, 220, 50)
  meJsonModule.save(site, role, subUser)
  itemModule.create(site.id)

  campLangModule()
  campModule()
  emailModule()
  enginesModule()
  countriesModule()
  currencies()
  emailAcquireTypes()
  schemaAtc()
}
