const fs = require('fs')

module.exports = function () {
  var languages = [
    {
      'slug': 'hu-informal',
      'name': 'Magyar (tegező)',
      'id': '561fdb74ee3e01b04d905059',
      '_id': '561fdb74ee3e01b04d905059'
    },
    {
      'slug': 'hu-formal',
      'name': 'Magyar (magázó)',
      'id': '561fdb74ee3e01b04d90505a',
      '_id': '561fdb74ee3e01b04d90505a'
    },
    {
      'slug': 'en-informal',
      'name': 'English (informal)',
      'id': '561fdb74ee3e01b04d90505b',
      '_id': '561fdb74ee3e01b04d90505b'
    }
  ]

  fs.writeFileSync('./app/mockapi/json/campaignitemlanguages.json', JSON.stringify(languages, null, 4))
}
