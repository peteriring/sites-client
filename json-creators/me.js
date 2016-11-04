const jsf = require('json-schema-faker')
const fs = require('fs')

var generator = {
  create: function (site, role, subUser) {
    var schema = {
      type: 'object',
      properties: {
        _id: subUser.id,
        site: site,
        role: role,
        email: subUser.email,
        firstName: subUser.firstName,
        lastName: subUser.lastName,
        createdAt: subUser.createdAt,
        updatedAt: subUser.updatedAt,
        id: subUser.id
      },
      required: ['_id', 'site', 'role', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt', 'id']
    }
    var me = jsf(schema)
    return me
  },

  save: function (site, role, subUser) {
    site.wizardFinished = true
    var wizardMe = this.create(site, role, subUser)
    site.wizardFinished = false
    subUser.id += 1
    site.id += 1
    site._id += 1
    var me = this.create(site, role, subUser)
    me.site.engine = ''
    var meArray = [wizardMe, me]

    fs.writeFileSync('./app/mockapi/json/finished.json', JSON.stringify(site, null, 4))
    fs.writeFileSync('./app/mockapi/json/me.json', JSON.stringify(meArray, null, 4))
  }
}

module.exports = generator
