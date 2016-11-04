'use strict'
/* global describe, expect, it, browser */

var LoginPage = require('../pages/login.js')

describe('check login', function () {
  it('should login successfully with email and password', function () {
    browser.get('http://localhost:9001/')

    expect(browser.getTitle()).toEqual('Login | GhostMonitor')

    var loginPage = new LoginPage()

    expect(loginPage.login()).toBe(true)
  })
})
