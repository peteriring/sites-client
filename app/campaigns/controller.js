'use strict'
/* global _*/

angular.module('GMClient')

  .config(function ($stateProvider) {
    $stateProvider.state('app.campaigns', {
      url: '/campaigns',
      templateUrl: 'campaigns/view.html',
      controller: 'CampaignsController',
      data: {
        title: 'Campaigns'
      },
      resolve: {
        ApiService: 'ApiService',
        data: function (ApiService) { return ApiService.nonblock.get(['me', 'me/campaigns']) }
      }
    })
  })

  .controller('CampaignsController', function ($scope, $modal, $q, $element, ApiService, log) {
    // ui values
    $scope.content = ''
    $scope.campaigns = []

    $scope.editEmailText = '<p>Email editing is coming in the next version of GhostMonitor.</p><p>If you\'d like to change something in your email, please <a href="mailto:hello@ghostmonitor.com">contact us</a>.</p>'
    $scope.addItemText = 'This feature is coming soon!'
    // init functions
    ApiService

      .get(['me', 'me/campaigns'])
      .then(function (result) {
        log.text('campaigns: user loaded', log.level.DEBUG)
        var campaigns = result.campaigns
        $scope.user = result.me
        $scope.billingEnabled = !($scope.user.site.isBillingActive !== 'active' && new Date($scope.user.site.trialEndsAt) < new Date())
        // disable all campaigns/items
        if (!$scope.billingEnabled) {
          $scope.campaigns = _.map(campaigns, function (campaign) {
            campaign.enabled = false
            campaign.items = _.map(campaign.items, function (item) {
              item.isEnabled = false
              return item
            })
            return campaign
          })
        } else {
          $scope.campaigns = campaigns
        }
      })
      .catch(function () {
        log.ui('campaigns: loading failure', log.level.ERROR)
      })

    // scope functions
    $scope.addItem = function (campaign) {
      $modal.open({
        templateUrl: 'campaigns/templates/itemModal.html',
        controller: 'ItemModalController',
        size: 'lg',
        resolve: {
          item: function () {
            return null
          },
          mode: function () {
            return 'new'
          },
          site: function () {
            return $scope.user.site
          }
        }
      }).result.then(function (item) {
        campaign.items.push(item)

        ApiService

          .put('campaigns/' + campaign.id, campaign, 'me/campaigns')
          .then(function () {
            log.text('campaigns: new campaign item added', log.level.DEBUG)
          })
          .catch(function () {
            log.ui('campaigns: adding a new campaign item failed', log.level.ERROR)
          })
      })
    }

    $scope.showEmailTest = function ($event) {
      $modal.open({
        templateUrl: 'core/templates/underConstructionModal.html',
        scope: $scope,
        controller: 'emailTestModalController',
        windowClass: 'under-construction'
      })
    }

    $scope.editEmail = function (item) {
      $modal.open({
        templateUrl: 'campaigns/templates/itemModal.html',
        controller: 'ItemModalController',
        size: 'lg',
        resolve: {
          item: function () {
            return item
          },
          mode: function () {
            return 'edit'
          },
          site: function () {
            return $scope.user.site
          }
        }
      }).result.then(function (item) {
        ApiService

          .put('campaignitems/' + item.id, item, 'me/campaigns')
          .then(function () {
            log.text('campaigns: campaign item updated', log.level.DEBUG)
          })
          .catch(function () {
            log.ui('campaigns: saving campaign item failed', log.level.ERROR)
          })
      })
    }

    $scope.previewEmail = function (item) {
      $modal.open({
        templateUrl: 'campaigns/templates/itemModal.html',
        controller: 'ItemModalController',
        size: 'lg',
        resolve: {
          item: function () {
            return item
          },
          mode: function () {
            return 'preview'
          },
          site: function () {
            return $scope.user.site
          },
          rendered: ApiService.get('me/editor/preview', {item: item._id})

        }
      })
    }

    $scope.toggleCampaign = function ($event, campaign) {
      if (!$scope.billingEnabled) {
        campaign.enabled = false
        return log.ui('Your trial period expired', log.level.INFO)
      }
      var button = $event ? $element.find($event.currentTarget) : null
      var compare = $event ? !campaign.enabled : campaign.enabled
      var promise = ApiService.put('me/switch/item', {'id': campaign._id, 'enabled': campaign.enabled, model: 'Campaign'}, 'me/campaigns')
        .then(function (result) {
          if ($event) campaign.enabled = !campaign.enabled
        })

      _.each(campaign.items, function (campaignItem) {
        if (campaignItem.isEnabled === compare) return

        promise
        .then(function () {
          return ApiService.put('me/switch/item', {'id': campaignItem._id, 'enabled': campaignItem.isEnabled, model: 'CampaignItem'})
        })
        .then(function (result) {
          campaignItem.isEnabled = result.data.isEnabled
        })
      })

      promise
        .catch(function () {
          log.ui('email changes saving failed', log.level.ERROR)
        })
        .finally(function () {
          log.ui('campaign changes saved', log.level.SUCCESS)
          if (button) button.prop('disabled', false)
        })
    }

    $scope.toggleItem = function ($event, item, campaign) {
      if (!$scope.billingEnabled) {
        item.isEnabled = false
        return log.ui('Your trial period expired', log.level.INFO)
      }
      if (!campaign.enabled) return log.ui('default campaign is disabled', log.level.INFO)
      var button = $event ? $element.find($event.currentTarget) : null
      ApiService.put('me/switch/item', {'id': item._id, 'enabled': $event ? item.isEnabled : !item.isEnabled, model: 'CampaignItem'}, 'me/campaigns')
        .then(function (result) {
          item.isEnabled = result.data.isEnabled
          log.ui('changes saved', log.level.SUCCESS)
        })
        .catch(function () {
          log.ui('changes saving failed', log.level.ERROR)
        })
        .finally(function () {
          if (button) button.prop('disabled', false)
        })
    }

    $scope.toggleStat = function (campaignItem) {
      campaignItem.showStat = !campaignItem.showStat
    }
  })
