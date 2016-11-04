'use strict'

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider

      .state('app.editor', {
        url: '/editor',
        template: '<div ui-view></div>',
        abstract: true,
        controller: 'EditorController'

      })

      .state('app.editor.campaignitem', {
        url: '/campaign/:campaignId/item/:itemId',
        templateUrl: 'editor/campaignitem/view.html',
        controller: 'CampaignItemEditorController',
        abstract: true,
        data: {
          title: 'Campaign Editor'
        },
        resolve: {
          ApiService: 'ApiService',
          data: function (ApiService, $q, $stateParams) {
            if (!$stateParams || !$stateParams.campaignId || !$stateParams.itemId) {
              return $q.reject('not valid parameters')
            }

            return ApiService.get(['me/editor/schema?campaign=' + $stateParams.campaignId + '&item=' + $stateParams.itemId + '&model=CampaignItem', 'me/campaigns', 'currencies'])
          }
        }
      })

      .state('app.editor.campaignitem.design', {
        url: '/design',
        templateUrl: 'editor/campaignitem/design.html'
      })

      .state('app.editor.campaignitem.text', {
        url: '/text',
        templateUrl: 'editor/campaignitem/text.html'
      })

      .state('app.editor.popup', {
        url: '/popup/:slug',
        templateUrl: 'editor/popup/view.html',
        controller: 'PopupEditorController',
        data: {
          title: 'ATC Popup Editor'
        },
        resolve: {
          ApiService: 'ApiService',
          data: function (ApiService, $q, $stateParams) {
            if (!$stateParams || !$stateParams.slug) {
              return $q.reject('not valid parameters')
            }
            return ApiService.get(['me/editor/schema?slug=' + $stateParams.slug + '&model=Tue'])
          }
          /* data: function (ApiService, $q, $stateParams) {
            return {
              popup: {
                schema: {
                  text: {
                    'closeable': {
                      value: true,
                      default: true,
                      label: 'Close button',
                      type: 'checkbox',
                      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam nulla laudantium, odio id adipisci ipsam!'
                    },
                    'h1': {
                      value: 'Your item is in your cart',
                      default: 'Your item is in your cart',
                      label: 'Heading',
                      type: 'input'
                    },
                    'text1': {
                      value: 'To continue shopping, please enter your email address.',
                      default: 'To continue shopping, please enter your email address.',
                      label: 'Text',
                      type: 'textarea'
                    },
                    'placeholder': {
                      value: 'Email address',
                      default: 'Email address',
                      label: 'Email placeholder',
                      type: 'input'
                    },
                    'cta': {
                      value: 'Continue Shopping',
                      default: 'Continue Shopping',
                      label: 'Button',
                      type: 'input'
                    }
                  },
                  exampleVariables: {
                    'link': '#'
                  }
                }
              }
            }
          }*/
        }
      })
  })
