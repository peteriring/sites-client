var shell = require('shelljs')
var moment = require('moment')

module.exports = {
  getVersion: function getVersion () {
    var version = shell.exec('git describe --tags', {silent: true}).output.replace(/(\r\n|\n|\r)/gm, '')
    var date = shell.exec('git log -1 --format="%cd"', {silent: true}).output.replace(/(\r\n|\n|\r)/gm, '')
    date = moment(new Date(date))
    var ver = `${version} - ${date.utc().format()}`
    return ver
  },
  getShortVersion: function () {
    var version = shell.exec('git describe --tags', {silent: true}).output.replace(/(\r\n|\n|\r)/gm, '')
    return version
  }
}
