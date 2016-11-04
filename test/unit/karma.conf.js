// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-01-31 using
// generator-karma 0.8.3

module.exports = function (config) {
  'use strict'

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/es5-shim/es5-shim.js',
      'bower_components/angular/angular.js',
      'bower_components/json3/lib/json3.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/satellizer/satellizer.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/bootstrap-validator/dist/validator.min.js',
      'bower_components/underscore/underscore.js',
      'bower_components/ui-router/release/angular-ui-router.js',
      'bower_components/angular-ui-sortable/sortable.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/angular-smart-table/dist/smart-table.js',
      'bower_components/moment/moment.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/ng-table/dist/ng-table.min.js',
      'bower_components/transitionize/dist/transitionize.js',
      'bower_components/fastclick/lib/fastclick.js',
      'bower_components/switchery/dist/switchery.js',
      'bower_components/ng-switchery/src/ng-switchery.js',
      'bower_components/rangy/rangy-core.js',
      'bower_components/rangy/rangy-classapplier.js',
      'bower_components/rangy/rangy-highlighter.js',
      'bower_components/rangy/rangy-selectionsaverestore.js',
      'bower_components/rangy/rangy-serializer.js',
      'bower_components/rangy/rangy-textrange.js',
      'bower_components/textAngular/dist/textAngular.js',
      'bower_components/textAngular/dist/textAngular-sanitize.js',
      'bower_components/textAngular/dist/textAngularSetup.js',
      'bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
      'bower_components/angular-mask/dist/ngMask.js',
      'bower_components/angular-ui-notification/dist/angular-ui-notification.min.js',
      'bower_components/logentries/product/le.js',
      'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
      'bower_components/ng-idle/angular-idle.js',
      'bower_components/teljs/dist/tel.js',
      'bower_components/teljs/dist/metadatalite.js',
      'bower_components/angular-q-spread/dist/q-spread.js',
      'bower_components/Chart.js/Chart.min.js',
      'bower_components/angular-chart.js/dist/angular-chart.js',
      'bower_components/jquery-knob/js/jquery.knob.js',
      'bower_components/nunjucks/browser/nunjucks.min.js',
      'bower_components/angular-minicolors/angular-minicolors.js',
      'bower_components/angular-ui-slider/src/slider.js',
      'bower_components/blueimp-file-upload/js/jquery.fileupload-angular.js',
      'bower_components/forerunner/js/dist/fdb-all.min.js',
      'bower_components/angular-elastic/elastic.js',
      // endbower

      // need to recognise GMClient module
      'app/core/preinit.js',
      'app/core/app.js',
      'app/**/*.js',
      'test/unit/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
      'app/mockapi/mock-services.js',
      'app/mockapi/http-mock-module.js'
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO

  // Uncomment the following lines if you are using grunt's server to run the tests
  // proxies: {
  //   '/': 'http://localhost:9000/'
  // },
  // URL root prevent conflicts with the site root
  // urlRoot: '_karma_'
  })
}
