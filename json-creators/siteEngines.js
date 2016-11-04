const fs = require('fs')

module.exports = function () {
  var engines = [
    {
      'name': 'shopify',
      'slug': 'Shopify',
      'id': '55ddcafcaf62a90646a9ea5b'
    },
    {
      'name': 'volusion',
      'slug': 'Volusion',
      'id': '55ddcafcaf62a90646a9ea5d'
    },
    {
      'name': 'bigcommerce',
      'slug': 'Bigcommerce',
      'id': '55ddcafcaf62a90646a9ea5e'
    },
    {
      'name': 'zenCart',
      'slug': 'ZenCart',
      'id': '55ddcafcaf62a90646a9ea5f'
    },
    {
      'name': 'joomla',
      'slug': 'Joomla',
      'id': '55ddcafcaf62a90646a9ea60'
    },
    {
      'name': 'joomla+virtueMart',
      'slug': 'Joomla + VirtueMart',
      'id': '55ddcafcaf62a90646a9ea61'
    },
    {
      'name': 'other',
      'slug': 'Other',
      'id': '55ddcafcaf62a90646a9ea62'
    },
    {
      'name': 'woocommerce',
      'slug': 'WooCommerce',
      'pluginUrl': 'https:\/\/plugins.ghostmonitor.com\/gm-plugin-woocommerce-v0.1.4.zip',
      'updatedAt': '2015-09-18T12:05:27.135Z',
      'id': '55ddcafcaf62a90646a9ea59'
    },
    {
      'name': 'opencart',
      'slug': 'Opencart',
      'pluginUrl': 'https:\/\/plugins.ghostmonitor.com\/install.ocmod.zip',
      'updatedAt': '2015-09-15T19:16:35.042Z',
      'id': '55ddcafcaf62a90646a9ea5c'
    },
    {
      'name': 'prestashop',
      'slug': 'PrestaShop',
      'pluginUrl': 'https:\/\/plugins.ghostmonitor.com\/gm-plugin-prestashop-v0.1.4.zip',
      'createdAt': '2015-09-15T19:08:32.623Z',
      'updatedAt': '2015-09-15T19:08:32.623Z',
      'id': '55f86edb08224a05004eb6a4'
    },
    {
      'name': 'magento',
      'slug': 'Magento',
      'pluginUrl': 'https:\/\/plugins.ghostmonitor.com\/ghostmonitor_magento_v0.1.2.zip',
      'updatedAt': '2015-09-15T19:48:45.965Z',
      'id': '55ddcafcaf62a90646a9ea5a'
    }
  ]

  fs.writeFileSync('./app/mockapi/json/siteengines.json', JSON.stringify(engines, null, 4))
}
