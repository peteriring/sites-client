'use strict'
/* global browser, element, by */

module.exports = function LoginPage () {
  var emailInput = element(by.model('user.email'))
  var passwordInput = element(by.model('user.password'))

  var loginButton = element(by.buttonText('Log in'))

  // var notification = element(by.css('.ui-notification'))

  var hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
      return classes.split(' ').indexOf(cls) !== -1
    })
  }

  this.login = function () {
    emailInput.sendKeys('test@domain.com')
    passwordInput.sendKeys('alma')

    return loginButton.click().then(function () {
      var driver = browser.driver
      var notificationLocator = by.css('.ui-notification')

      return driver

        .wait(function () {
          return driver.findElements(notificationLocator).then(function (array) {
            return array.length ? array[0] : false
          })
        }, 10000)
        .then(function (element) {
          return hasClass(element, 'success')
        })
    })
  }
}
