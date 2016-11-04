const fs = require('fs')

module.exports = function () {
  var currencies = [
    {
      '_id': '56b9df1c1b794aa60039bbae',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'USD',
      'name': 'US Dollar',
      'symbol': '$',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbae'
    },
    {
      '_id': '56b9df1c1b794aa60039bbaf',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'AUD',
      'name': 'Australian Dollar',
      'symbol': '$',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbaf'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb0',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'KRW',
      'name': 'Korean Won',
      'symbol': '₩',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb0'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb1',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'JPY',
      'name': 'Japanese Yen',
      'symbol': '¥',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb1'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb2',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'BGN',
      'name': 'Bulgarian Lev',
      'symbol': 'лB',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb2'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb3',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'CZK',
      'name': 'Czech Koruna',
      'symbol': 'Kč',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb3'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb4',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'DKK',
      'name': 'Danish Krone',
      'symbol': 'kr',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb4'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb5',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'GBP',
      'name': 'UK Pound',
      'symbol': '£',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb5'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb6',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'HUF',
      'name': 'Hungarian Forint',
      'symbol': 'Ft',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb6'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb7',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'LTL',
      'name': 'Lithuanian Litas',
      'symbol': 'Lt',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb7'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb8',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'LVL',
      'name': 'Latvian Lat',
      'symbol': 'Ls',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb8'
    },
    {
      '_id': '56b9df1c1b794aa60039bbb9',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'PLN',
      'name': 'Polish Zloty',
      'symbol': 'zł',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbb9'
    },
    {
      '_id': '56b9df1c1b794aa60039bbba',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'RON',
      'name': 'Romanian New Leu',
      'symbol': 'lei',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbba'
    },
    {
      '_id': '56b9df1c1b794aa60039bbbb',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'SEK',
      'name': 'Swedish Krona',
      'symbol': 'kr',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbbb'
    },
    {
      '_id': '56b9df1c1b794aa60039bbbc',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'CHF',
      'name': 'Swiss Franc',
      'symbol': 'CHF',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbbc'
    },
    {
      '_id': '56b9df1c1b794aa60039bbbd',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'NOK',
      'name': 'Norwegian Krone',
      'symbol': 'kr',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbbd'
    },
    {
      '_id': '56b9df1c1b794aa60039bbbe',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'HRK',
      'name': 'Croatian Kruna',
      'symbol': 'kn',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbbe'
    },
    {
      '_id': '56b9df1c1b794aa60039bbbf',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'RUB',
      'name': 'Russian Ruble',
      'symbol': 'руб',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbbf'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc0',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'TRY',
      'name': 'Turkish Lira',
      'symbol': '₤',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc0'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc1',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'BRL',
      'name': 'Brazilian Real',
      'symbol': 'R$',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc1'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc2',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'CAD',
      'name': 'Canadan Dollar',
      'symbol': '$',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc2'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc3',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'CNY',
      'name': 'Chinese Yuan',
      'symbol': '¥',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc3'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc4',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'HKD',
      'name': 'Hong Kong Dollar',
      'symbol': '$',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc4'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc5',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'IDR',
      'name': 'Indonesian Rupiah',
      'symbol': 'Rp',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc5'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc6',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'ILS',
      'name': 'Israeli Shekel',
      'symbol': '₪',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc6'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc7',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'INR',
      'name': 'Indian Rupee',
      'symbol': '₨',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc7'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc8',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'MXN',
      'name': 'Mexican Peso',
      'symbol': '$',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc8'
    },
    {
      '_id': '56b9df1c1b794aa60039bbc9',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'MYR',
      'name': 'Malaysian Ringgit',
      'symbol': 'RM',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbc9'
    },
    {
      '_id': '56b9df1c1b794aa60039bbca',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'NZD',
      'name': 'New Zealand Dollar',
      'symbol': '$',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbca'
    },
    {
      '_id': '56b9df1c1b794aa60039bbcb',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'PHP',
      'name': 'Philippine Peso',
      'symbol': '₱',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbcb'
    },
    {
      '_id': '56b9df1c1b794aa60039bbcc',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'SGD',
      'name': 'Singaporean Dollar',
      'symbol': '$',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbcc'
    },
    {
      '_id': '56b9df1c1b794aa60039bbcd',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'THB',
      'name': 'Thai Baht',
      'symbol': '฿',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbcd'
    },
    {
      '_id': '56b9df1c1b794aa60039bbce',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'ZAR',
      'name': 'South African Rand',
      'symbol': 'R',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbce'
    },
    {
      '_id': '56b9df1c1b794aa60039bbcf',
      'updatedAt': '2016-02-09T12:44:12.000Z',
      'createdAt': '2016-02-09T12:44:12.000Z',
      'slug': 'EUR',
      'name': 'Euro',
      'symbol': '€',
      'template': '<%= symbol %><%= amount %>',
      '__v': 0,
      'id': '56b9df1c1b794aa60039bbcf'
    }
  ]

  fs.writeFileSync('./app/mockapi/json/currencies.json', JSON.stringify(currencies, null, 4))
}
