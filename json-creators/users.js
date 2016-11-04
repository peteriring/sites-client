const jsf = require('json-schema-faker')
const fs = require('fs')

var generator = {
  create: function (siteId, role, subUser, token) {
    var schema = {
      type: 'object',
      properties: {
        token: token,
        user: {
          type: 'object',
          properties: {
            _id: subUser.id,
            site: siteId,
            role: role,
            email: 'gm@gm.com',
            firstName: subUser.firstName,
            lastName: subUser.lastName,
            createdAt: subUser.createdAt,
            updatedAt: subUser.updatedAt,
            id: subUser.id
          },
          required: ['_id', 'site', 'role', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt', 'id']
        }
      },
      required: ['token', 'user']
    }
    var user = jsf(schema)
    user.user.id += 1
    user.user._id += 1
    user.user.site += 1
    var wizardUser = jsf(schema)
    wizardUser.token = 'fg4435h6h234t3tg3g'

    var users = [wizardUser, user]

    fs.writeFileSync('./app/mockapi/json/users.json', JSON.stringify(users, null, 4))

    return user
  }
}

module.exports = generator
