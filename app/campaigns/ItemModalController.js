'use strict'
/* global nunjucks */

angular.module('GMClient')

  .controller('ItemModalController', function ($scope, $modalInstance, $filter, rendered, item, mode, site) {
    // ui values
    $scope.template = rendered.preview
    var items = [{
      name: 'Test product 1',
      productId: 1,
      price: '$10',
      productUrl: 'http://test.com',
      category: '',
      qty: 1,
      qtyPrice: '$10',
      imageUrl: 'http://cutepuppyclub.com/wp-content/uploads/2015/05/White-Cute-Puppy-.jpg'
    }]

    $scope.template = nunjucks.renderString(rendered.preview, { cart: { 'items': items, data: { value: 100 } } })
  })
