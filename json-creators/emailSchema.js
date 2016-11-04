const fs = require('fs')

module.exports = function () {
  var schema1 = {
    'schema': {
      'text': {
        'subject': {
          'label': 'Subject',
          'type': 'subject',
          'value': 'Hoppá valami baj történt?',
          'default': 'Hoppá valami baj történt?'
        },
        'preaheader': {
          'label': 'Pre-header',
          'type': 'input',
          'value': 'Nem fejezted be a vásárlásod! Segíthetünk valamiben?',
          'default': 'Nem fejezted be a vásárlásod! Segíthetünk valamiben?'
        },
        'h1': {
          'label': 'Title',
          'type': 'input',
          'value': 'Hoppá valami baj történt?',
          'default': 'Hoppá valami baj történt?'
        },
        'p1': {
          'label': 'Paragraph 1',
          'type': 'textarea',
          'requiredVariables': [
            'domain'
          ],
          'value': 'Kedves Vásárlónk! <br><br> Köszönjük, hogy a lol.com választottad! Szomorúan látjuk, hogy valamilyen oknál fogva abbahagytad a vásárlást oldalunkon... Azért küldtük ez a levelet, hogy értesítsünk:',
          'default': 'Kedves Vásárlónk! <br><br> Köszönjük, hogy a lol.com választottad! Szomorúan látjuk, hogy valamilyen oknál fogva abbahagytad a vásárlást oldalunkon... Azért küldtük ez a levelet, hogy értesítsünk:'
        },
        'h2': {
          'label': 'Highlighted Text',
          'type': 'input',
          'value': 'A kosarad tartalmát elmentettük!',
          'default': 'A kosarad tartalmát elmentettük!'
        },
        'cartHeader': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Ezeket hagytad nemrég a kosaradban:',
          'default': 'Ezeket hagytad nemrég a kosaradban:'
        },
        'cartHeaderItemDescription': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Termék leírása',
          'default': 'Termék leírása'
        },
        'cartHeaderItemPrice': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Ár',
          'default': 'Ár'
        },
        'cartHeaderItemQty': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Mennyiség',
          'default': 'Mennyiség'
        },
        'cartHeaderItemTotal': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Összesen',
          'default': 'Összesen'
        },
        'cta': {
          'label': 'CTA Text',
          'type': 'input',
          'value': 'Fejezd be vásárlásod most! ',
          'default': 'Fejezd be vásárlásod most! '
        },
        'p2': {
          'label': 'Paragraph 2',
          'requiredVariables': [
            'cartLink'
          ],
          'type': 'textarea',
          'value': 'Figyelem! A kiválasztott termék ára bármikor emelkedhet, vagy kifogyhatunk a készletből, így érdemes minél hamarabb véglegesítened rendelésed! <br> {{cartLink}}Kattints ide{{/cartLink}} és fejezd be vásárlásod most! <br> További szép napot kíván Neked, <br> A {{siteName}} csapata',
          'default': 'Figyelem! A kiválasztott termék ára bármikor emelkedhet, vagy kifogyhatunk a készletből, így érdemes minél hamarabb véglegesítened rendelésed! <br> {{cartLink}}Kattints ide{{/cartLink}} és fejezd be vásárlásod most! <br> További szép napot kíván Neked, <br> A {{siteName}} csapata'
        },
        'footer': {
          'label': 'Footer',
          'type': 'textarea',
          'requiredVariables': [
            'siteName'
          ],
          'value': 'Ezt a levelet azért kaptad, mert elkezdtél egy vásárlást a {{siteName}} oldalán, amit végül nem fejeztél be. Ha kérdésed lenne a vásárlással kapcsolatban, keress minket bátran az alábbi elérhetőségeken:',
          'default': 'Ezt a levelet azért kaptad, mert elkezdtél egy vásárlást a {{siteName}} oldalán, amit végül nem fejeztél be. Ha kérdésed lenne a vásárlással kapcsolatban, keress minket bátran az alábbi elérhetőségeken:'
        },
        'unsubscribe': {
          'label': 'Unsubscribe',
          'type': 'hidden',
          'value': '{{unsubscribeLink}}Leiratkozás{{/unsubscribeLink}}',
          'default': '{{unsubscribeLink}}Leiratkozás{{/unsubscribeLink}}'
        }
      },
      'design': {
        'color-header-txt': {
          'label': 'Header text',
          'type': 'color-picker',
          'value': '#878787',
          'default': '#878787'
        },
        'color-header-bg': {
          'label': 'Header background',
          'type': 'color-picker',
          'value': '#f3f5f6',
          'default': '#f3f5f6'
        },
        'color-h1-txt': {
          'label': 'Title',
          'type': 'color-picker',
          'value': '#878787',
          'default': '#878787'
        },
        'color-h2-txt': {
          'label': 'Title 2',
          'type': 'color-picker',
          'value': '#2bba82',
          'default': '#2bba82'
        },
        'color-h2-bg': {
          'label': 'Title 2 background',
          'type': 'color-picker',
          'value': '#f3f5f6',
          'default': '#f3f5f6'
        },
        'color-button-bg': {
          'label': 'Button color',
          'type': 'color-picker',
          'value': '#2bba82',
          'default': '#2bba82'
        },
        'color-button-txt': {
          'label': 'Button text',
          'type': 'color-picker',
          'value': '#ffffff',
          'default': '#ffffff'
        },
        'color-link-txt': {
          'label': 'Link',
          'type': 'color-picker',
          'value': '#2bba82',
          'default': '#2bba82'
        },
        'font-family': {
          'label': '',
          'type': 'enum',
          'value': "'Nunito', sans-serif",
          'default': "'Nunito', sans-serif"
        }
      },
      'image': {
        'logo': {
          'value': 'https://static.ghostmonitor.com/email/cart-icon.png',
          'default': 'https://static.ghostmonitor.com/email/cart-icon.png'
        }
      },
      'exampleVariables': {
        'domain': '<a href="http://magfitpro.com">http://magfitpro.com</a>',
        'unsubscribeLink': '<a href="http://domain.com">',
        '/unsubscribeLink': '</a>',
        'cartLink': '<a href="http://domain.com">',
        '/cartLink': '</a>',
        'siteName': 'Magfitpro',
        'discount': 0
      },
      'schedule': {
        'minutes': 0,
        'hours': 0,
        'days': 0
      }
    },
    'template': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<!-- saved from url=(0048)http://email.szallas.hu/i/t9IXpDBkwzfsVHD8uBTqVA -->\n<html xmlns="http://www.w3.org/1999/xhtml">\n\n<head>\n    <title>Oops... Was there a problem checking out?</title>\n    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n\n    <style type="text/css">\n        @media only screen and (max-width: 600px) {\n            table {\n                width: 100% !important;\n            }\n\n            td[class=center] {\n                text-align: center !important;\n            }\n        }\n    </style>\n    <!-- inlinestyle -->\n</head>\n\n<body cz-shortcut-listen="true">\n<div class="main-container">\n    <!--[if (gte mso 9)|(IE)]>\n    <div class="gte-mso-9-container">\n        <table border="0" cellpadding="0" cellspacing="0" align="center" class="gte-mso-9-table-container">\n    <![endif]-->\n\n    <div class="main-wrapper">\n        <table border="0" cellpadding="0" cellspacing="0" align="center">\n            <tbody>\n            <!-- Content wrapper -->\n            <tr class="content-wrapper">\n                <td>\n                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">\n                        <tbody>\n                        <!-- Header -->\n                        <tr class="header">\n                            <td class="center" align="left" valign="middle">\n                                <img src="@@logo" alt="Complete Your checkout!" />\n                                <span text-bind="schema.text.preaheader"></span>\n                            </td>\n                        </tr>\n                        <!-- END Header -->\n\n                        <tr class="mail-title">\n                            <td align="center">\n                                <strong text-bind="schema.text.h1"></strong>\n                            </td>\n                        </tr>\n\n                        <tr class="mail-description">\n                            <td align="left" text-bind="schema.text.p1">\n                            </td>\n                        </tr>\n\n                        <tr class="highlighted-message">\n                            <td class="center" align="left" valign="middle" text-bind="schema.text.h2">\n                            </td>\n                        </tr>\n\n                        <!-- Cart offer -->\n                        <tr class="cart-offer">\n                            <td>\n                                <p text-bind="schema.text.cartHeader"></p>\n                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="left" class="center">\n                                    <thead>\n                                        <th></th>\n                                        <th text-bind="schema.text.cartHeaderItemDescription"></th>\n                                        <th text-bind="schema.text.cartHeaderItemPrice"></th>\n                                        <th text-bind="schema.text.cartHeaderItemQty"></th>\n                                        <th text-bind="schema.text.cartHeaderItemTotal"></th>\n                                    </thead>\n                                    <tbody>\n                                    {% for item in cart.items %}\n                                    <tr class="cart-item">\n                                        <td align="center">\n                                            <div>\n                                                <img src="{{item.imageUrl}}" alt="{{item.name}}" width="120" />\n                                            </div>\n                                        </td>\n                                        <td align="center" class="cart-item-name">\n                                            <a href="{{item.productUrl}}">{{item.name}}</a>\n                                        </td>\n                                        <td align="center">{{item.price}}</td>\n                                        <td align="center">{{item.qty}}</td>\n                                        <td align="center">{{item.qtyPrice}}</td>\n                                    </tr>\n                                    {% endfor %}\n                                    <tr>\n                                        <td colspan="4" align="right">Total:</td>\n                                        <td colspan="4" align="right" >{{cart.data.value}}</td>\n                                    </tr>\n                                    </tbody>\n                                </table>\n                            </td>\n                        </tr>\n                        <!-- END Cart offer -->\n\n                        <!-- Action button -->\n                        <tr class="action-button">\n                            <td align="right">\n                                <table align="right">\n                                    <tr>\n                                        <td align="center">\n                                            <table border="0" cellspacing="0" cellpadding="0" class="button">\n                                                <tr>\n                                                    <td align="center">\n                                                        <a href="{{cartLink}}" target="_blank" text-bind="schema.text.cta"></a>\n                                                    </td>\n                                                </tr>\n                                            </table>\n                                        </td>\n                                    </tr>\n                                </table>\n                            </td>\n                        </tr>\n                        <!-- END Action button -->\n\n                        <!-- Bottom text -->\n                        <tr class="bottom-text">\n                            <td align="left">\n                                <p text-bind="schema.text.p2"></p>\n                                <!--<p>\n                                    <span text-bind="schema.text.bye"></span>\n                                    <br/>\n                                    <span text-bind="schema.text.team"></span>\n                                </p>-->\n                            </td>\n                        </tr>\n                        <!-- END Bottom text -->\n\n                        </tbody>\n                    </table>\n                </td>\n            </tr>\n            <!-- END Content wrapper -->\n            <!-- Footer -->\n            <tr class="footer">\n                <td valign="middle" align="left">\n                    <table cellpadding="0" cellspacing="0" border="0">\n                        <tr>\n                            <td>\n                                <p text-bind="schema.text.footer"></p>\n                                <p><a href="mailto:{{site.emailSettings.senderEmail}}">{{site.emailSettings.senderEmail}}</a></p>\n                                <p text-bind="schema.text.unsubscribe"></p>\n                            </td>\n                        </tr>\n                    </table>\n\n                </td>\n            </tr>\n            <!-- END Footer -->\n            </tbody>\n        </table>\n    </div>\n    <!--[if (gte mso 9)|(IE)]>\n    </table>\n    </div>\n    <![endif]-->\n</div>\n</body>\n</html>\n',
    'style': "$color-header-txt: @@color-header-txt;\n$color-header-bg: @@color-header-bg;\n$color-h1-txt: @@color-h1-txt;\n$color-h2-txt: @@color-h2-txt;\n$color-h2-bg: @@color-h2-bg;\n$color-button-bg: @@color-button-bg;\n$color-button-txt: @@color-button-txt;\n$color-link-txt: @@color-link-txt;\n\n$font-family: 'Nunito', sans-serif;\n\nbody {\n    margin: 0 auto;\n    font-family: $font-family;\n    background-color: #fff;\n    a {\n        color: $color-link-txt;\n    }\n}\n\n.gte-mso-9-container {\n    margin: 20px auto;\n    width: 598px;\n    font-family: $font-family;\n    background-color: #fff;\n    border: 1px solid #d9d9d9;\n}\n\n.gte-mso-9-table-container {\n    padding: 0;\n    width: 600px;\n    margin: 0 auto;\n    font-family: $font-family;\n    font-size: 14px;\n    color: #333;\n}\n\n.main-container {\n    margin: 0 auto;\n    font-family: $font-family;\n    background-color: #fff;\n}\n\n.main-wrapper {\n    margin: 20px auto;\n    max-width: 598px;\n    font-family: $font-family;\n    background-color: #fff;\n    border: 1px solid #d9d9d9;\n    a {\n        color: $color-link-txt;\n    }\n    > table {\n        max-width: 600px;\n        margin: 0 auto;\n        font-family: $font-family;\n        font-size: 14px;\n        color: #333;\n        .content-wrapper {\n            > td {\n                &,\n                > table {\n                    background-color: #fff;\n                }\n            }\n            .header {\n                td {\n                    background-color: $color-header-bg;\n                    color: $color-header-txt;\n                    padding: 15px 20px;\n                    font-size: 14px;\n                    font-family: $font-family;\n                    text-align: center;\n                }\n                img {\n                    display: block;\n                    margin: 0px auto 10px auto;\n                    max-width: 100px;\n                }\n            }\n            .mail-title {\n                td {\n                    padding: 20px;\n                    font-family: $font-family;\n                    color: $color-h1-txt;\n                    font-size: 22px;\n                    line-height: 28px;\n                    text-align: center;\n                }\n            }\n            .mail-description {\n                td {\n                    padding: 15px 20px;\n                    font-family: $font-family;\n                    color: #333;\n                    font-size: 14px;\n                    line-height: 22px;\n                }\n                p {\n                    margin-top: 0px;\n                    padding-top: 0px;\n                }\n            }\n            .highlighted-message td {\n                background-color: $color-h2-bg;\n                padding: 15px 20px;\n                font-size: 22px;\n                color: $color-h2-txt;\n                font-family: $font-family;\n                text-align: center;\n            }\n            .cart-offer {\n                > td  {\n                    padding: 15px 20px;\n                    > p {\n                        font-size: 14px;\n                        line-height: 18px;\n                        font-family: $font-family;\n                        margin: 0px;\n                        padding: 15px 0px 10px 0px;\n                        color: #878787;\n                    }\n                }\n                th {\n                    font-family: $font-family;\n                    font-size: 14px;\n                    color: #878787;\n                    border-top: 1px solid #dfe3e6;\n                    border-bottom: 1px solid #dfe3e6;\n                    padding: 15px 5px;\n                }\n                tbody {\n                    tr:first-child {\n                        > td {\n                            border-bottom: 1px solid #dfe3e6;\n                            padding: 15px 5px;\n                            font-family: $font-family;\n                            color: #878787; font-size: 14px;\n                            text-align: center;\n                        }\n                    }\n\n                    tr:last-child {\n                        > td {\n                            padding: 20px 5px;\n                            font-family: $font-family;\n                            color: #878787;\n                            font-size: 14px;\n                            border-bottom: 1px solid #dfe3e6;\n                            &:last-child {\n                                white-space:nowrap;\n                            }\n                        }\n                    }\n                }\n                .cart-item {\n                    td:first-child {\n                        border-bottom: 1px solid #dfe3e6;\n                        padding: 15px 5px;\n                        div {\n                            width: 90px;\n                            height: 90px;\n                            overflow: hidden;\n                        }\n                        img {\n                            max-width: 90px;\n                            max-height: 90px;\n                            display: block;\n                            border-radius: 50%;\n                            border: 1px solid #d9d9d9;\n                        }\n                    }\n                    .cart-item-name a {\n                        color: $color-link-txt;\n                    }\n                }\n            }\n            .action-button {\n                > td {\n                    padding: 15px 20px;\n                }\n                table {\n                    width: auto !important;\n                    tr > td {\n                        padding: 5px 0px 8px 0px;\n                    }\n                    .button {\n                        td {\n                            font-family: $font-family;\n                            font-size: 18px;\n                            color: #fff;\n                            background-color: $color-button-bg;\n                            a {\n                                font-family: $font-family;\n                                font-size: 18px;\n                                color: $color-button-txt;\n                                background-color: $color-button-bg;\n                                text-decoration: none;\n                                border-radius: 5px;\n                                padding: 15px 40px;\n                            }\n                        }\n                    }\n                }\n            }\n            .bottom-text {\n                td {\n                    padding: 30px 20px 15px 20px;\n                    font-family: $font-family;\n                    color: #878787;\n                    font-size: 14px;\n                    line-height: 22px;\n                }\n                p {\n                    margin: 0px;\n                    padding-bottom: 15px;\n                }\n            }\n        }\n        .footer {\n            > td {\n                padding: 0px 20px 20px 20px;\n                table {\n                    border-top: 1px solid #dfe3e6;\n                    td {\n                        font-family: $font-family;\n                        font-size: 12px;\n                        color: #b5b5b5;\n                        padding-top: 30px;\n                        p {\n                            margin: 0;\n                            &:first-child {\n                                padding-bottom: 15px;\n                            }\n                            a {\n                                color: #b5b5b5;\n                                text-decoration: none;\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n}",
    'isEnabled': true,
    'id': '56af5780bee827fedf4ae853'
  }

  var schema2 = {
    'schema': {
      'text': {
        'subject': {
          'label': 'Subject',
          'type': 'subject',
          'value': 'A terméked hamarosan elfogy készletről!',
          'default': 'A terméked hamarosan elfogy készletről!'
        },
        'preaheader': {
          'label': 'Pre-header',
          'type': 'input',
          'value': 'Már alig van készleten az általad választott termékből. Fejezd be vásárlásod most!',
          'default': 'Már alig van készleten az általad választott termékből. Fejezd be vásárlásod most!'
        },
        'h1': {
          'label': 'Title',
          'type': 'input',
          'value': 'A terméked hamarosan elfogy készletről!',
          'default': 'A terméked hamarosan elfogy készletről!'
        },
        'p1': {
          'label': 'Paragraph 1',
          'type': 'textarea',
          'requiredVariables': [
            'domain'
          ],
          'value': 'Kedves Vásárlónk! <br><br> Észrevettük, mennyire szeretnél hozzájutni az egyik termékünkhöz, ezért küldjük most ezt az emlékeztető levelet:',
          'default': 'Kedves Vásárlónk! <br><br> Észrevettük, mennyire szeretnél hozzájutni az egyik termékünkhöz, ezért küldjük most ezt az emlékeztető levelet:'
        },
        'h2': {
          'label': 'Highlighted Text',
          'type': 'input',
          'value': 'Az általad választott termék hamarosan el fog fogyni!',
          'default': 'Az általad választott termék hamarosan el fog fogyni!'
        },
        'cartHeader': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Ezeket hagytad nemrég a kosaradban:',
          'default': 'Ezeket hagytad nemrég a kosaradban:'
        },
        'cartHeaderItemDescription': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Termék leírása',
          'default': 'Termék leírása'
        },
        'cartHeaderItemPrice': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Ár',
          'default': 'Ár'
        },
        'cartHeaderItemQty': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Mennyiség',
          'default': 'Mennyiség'
        },
        'cartHeaderItemTotal': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Összesen',
          'default': 'Összesen'
        },
        'cta': {
          'label': 'CTA Text',
          'type': 'input',
          'value': 'Fejezd be vásárlásod most! ',
          'default': 'Fejezd be vásárlásod most! '
        },
        'p2': {
          'label': 'Paragraph 2',
          'requiredVariables': [
            'cartLink'
          ],
          'type': 'textarea',
          'value': 'Figyelem! A kiválasztott termék ára bármikor emelkedhet, vagy kifogyhatunk a készletből, így érdemes minél hamarabb véglegesítened rendelésed! <br> {{cartLink}}Kattints ide{{/cartLink}} és fejezd be vásárlásod most! <br> További szép napot kíván Neked, <br> A {{siteName}} csapata',
          'default': 'Figyelem! A kiválasztott termék ára bármikor emelkedhet, vagy kifogyhatunk a készletből, így érdemes minél hamarabb véglegesítened rendelésed! <br> {{cartLink}}Kattints ide{{/cartLink}} és fejezd be vásárlásod most! <br> További szép napot kíván Neked, <br> A {{siteName}} csapata'
        },
        'footer': {
          'label': 'Footer',
          'type': 'textarea',
          'requiredVariables': [
            'siteName'
          ],
          'value': 'Ezt a levelet azért kaptad, mert elkezdtél egy vásárlást a {{siteName}} oldalán, amit végül nem fejeztél be. Ha kérdésed lenne a vásárlással kapcsolatban, keress minket bátran az alábbi elérhetőségeken:',
          'default': 'Ezt a levelet azért kaptad, mert elkezdtél egy vásárlást a {{siteName}} oldalán, amit végül nem fejeztél be. Ha kérdésed lenne a vásárlással kapcsolatban, keress minket bátran az alábbi elérhetőségeken:'
        },
        'unsubscribe': {
          'label': 'Unsubscribe',
          'type': 'hidden',
          'value': '{{unsubscribeLink}}Leiratkozás{{/unsubscribeLink}}',
          'default': '{{unsubscribeLink}}Leiratkozás{{/unsubscribeLink}}'
        }
      },
      'design': {
        'color-header-txt': {
          'label': 'Header text',
          'type': 'color-picker',
          'value': '#878787',
          'default': '#878787'
        },
        'color-header-bg': {
          'label': 'Header background',
          'type': 'color-picker',
          'value': '#f3f5f6',
          'default': '#f3f5f6'
        },
        'color-h1-txt': {
          'label': 'Title',
          'type': 'color-picker',
          'value': '#878787',
          'default': '#878787'
        },
        'color-h2-txt': {
          'label': 'Title 2',
          'type': 'color-picker',
          'value': '#2bba82',
          'default': '#2bba82'
        },
        'color-h2-bg': {
          'label': 'Title 2 background',
          'type': 'color-picker',
          'value': '#f3f5f6',
          'default': '#f3f5f6'
        },
        'color-button-bg': {
          'label': 'Button color',
          'type': 'color-picker',
          'value': '#2bba82',
          'default': '#2bba82'
        },
        'color-button-txt': {
          'label': 'Button text',
          'type': 'color-picker',
          'value': '#ffffff',
          'default': '#ffffff'
        },
        'color-link-txt': {
          'label': 'Link',
          'type': 'color-picker',
          'value': '#2bba82',
          'default': '#2bba82'
        },
        'font-family': {
          'label': '',
          'type': 'enum',
          'value': "'Nunito', sans-serif",
          'default': "'Nunito', sans-serif"
        }
      },
      'image': {
        'logo': {
          'value': 'https://static.ghostmonitor.com/email/cart-icon.png',
          'default': 'https://static.ghostmonitor.com/email/cart-icon.png'
        }
      },
      'exampleVariables': {
        'domain': '<a href="http://magfitpro.com">http://magfitpro.com</a>',
        'unsubscribeLink': '<a href="http://domain.com">',
        '/unsubscribeLink': '</a>',
        'cartLink': '<a href="http://domain.com">',
        '/cartLink': '</a>',
        'siteName': 'Magfitpro',
        'discount': 0
      },
      'schedule': {
        'minutes': 0,
        'hours': 24,
        'days': 0
      }
    },
    'template': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<!-- saved from url=(0048)http://email.szallas.hu/i/t9IXpDBkwzfsVHD8uBTqVA -->\n<html xmlns="http://www.w3.org/1999/xhtml">\n\n<head>\n    <title>Oops... Was there a problem checking out?</title>\n    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n\n    <style type="text/css">\n        @media only screen and (max-width: 600px) {\n            table {\n                width: 100% !important;\n            }\n\n            td[class=center] {\n                text-align: center !important;\n            }\n        }\n    </style>\n    <!-- inlinestyle -->\n</head>\n\n<body cz-shortcut-listen="true">\n<div class="main-container">\n    <!--[if (gte mso 9)|(IE)]>\n    <div class="gte-mso-9-container">\n        <table border="0" cellpadding="0" cellspacing="0" align="center" class="gte-mso-9-table-container">\n    <![endif]-->\n\n    <div class="main-wrapper">\n        <table border="0" cellpadding="0" cellspacing="0" align="center">\n            <tbody>\n            <!-- Content wrapper -->\n            <tr class="content-wrapper">\n                <td>\n                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">\n                        <tbody>\n                        <!-- Header -->\n                        <tr class="header">\n                            <td class="center" align="left" valign="middle">\n                                <img src="@@logo" alt="Complete Your checkout!" />\n                                <span text-bind="schema.text.preaheader"></span>\n                            </td>\n                        </tr>\n                        <!-- END Header -->\n\n                        <tr class="mail-title">\n                            <td align="center">\n                                <strong text-bind="schema.text.h1"></strong>\n                            </td>\n                        </tr>\n\n                        <tr class="mail-description">\n                            <td align="left" text-bind="schema.text.p1">\n                            </td>\n                        </tr>\n\n                        <tr class="highlighted-message">\n                            <td class="center" align="left" valign="middle" text-bind="schema.text.h2">\n                            </td>\n                        </tr>\n\n                        <!-- Cart offer -->\n                        <tr class="cart-offer">\n                            <td>\n                                <p text-bind="schema.text.cartHeader"></p>\n                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="left" class="center">\n                                    <thead>\n                                        <th></th>\n                                        <th text-bind="schema.text.cartHeaderItemDescription"></th>\n                                        <th text-bind="schema.text.cartHeaderItemPrice"></th>\n                                        <th text-bind="schema.text.cartHeaderItemQty"></th>\n                                        <th text-bind="schema.text.cartHeaderItemTotal"></th>\n                                    </thead>\n                                    <tbody>\n                                    {% for item in cart.items %}\n                                    <tr class="cart-item">\n                                        <td align="center">\n                                            <div>\n                                                <img src="{{item.imageUrl}}" alt="{{item.name}}" width="120" />\n                                            </div>\n                                        </td>\n                                        <td align="center" class="cart-item-name">\n                                            <a href="{{item.productUrl}}">{{item.name}}</a>\n                                        </td>\n                                        <td align="center">{{item.price}}</td>\n                                        <td align="center">{{item.qty}}</td>\n                                        <td align="center">{{item.qtyPrice}}</td>\n                                    </tr>\n                                    {% endfor %}\n                                    <tr>\n                                        <td colspan="4" align="right">Total:</td>\n                                        <td colspan="4" align="right" >{{cart.data.value}}</td>\n                                    </tr>\n                                    </tbody>\n                                </table>\n                            </td>\n                        </tr>\n                        <!-- END Cart offer -->\n\n                        <!-- Action button -->\n                        <tr class="action-button">\n                            <td align="right">\n                                <table align="right">\n                                    <tr>\n                                        <td align="center">\n                                            <table border="0" cellspacing="0" cellpadding="0" class="button">\n                                                <tr>\n                                                    <td align="center">\n                                                        <a href="{{cartLink}}" target="_blank" text-bind="schema.text.cta"></a>\n                                                    </td>\n                                                </tr>\n                                            </table>\n                                        </td>\n                                    </tr>\n                                </table>\n                            </td>\n                        </tr>\n                        <!-- END Action button -->\n\n                        <!-- Bottom text -->\n                        <tr class="bottom-text">\n                            <td align="left">\n                                <p text-bind="schema.text.p2"></p>\n                                <!--<p>\n                                    <span text-bind="schema.text.bye"></span>\n                                    <br/>\n                                    <span text-bind="schema.text.team"></span>\n                                </p>-->\n                            </td>\n                        </tr>\n                        <!-- END Bottom text -->\n\n                        </tbody>\n                    </table>\n                </td>\n            </tr>\n            <!-- END Content wrapper -->\n            <!-- Footer -->\n            <tr class="footer">\n                <td valign="middle" align="left">\n                    <table cellpadding="0" cellspacing="0" border="0">\n                        <tr>\n                            <td>\n                                <p text-bind="schema.text.footer"></p>\n                                <p><a href="mailto:{{site.emailSettings.senderEmail}}">{{site.emailSettings.senderEmail}}</a></p>\n                                <p text-bind="schema.text.unsubscribe"></p>\n                            </td>\n                        </tr>\n                    </table>\n\n                </td>\n            </tr>\n            <!-- END Footer -->\n            </tbody>\n        </table>\n    </div>\n    <!--[if (gte mso 9)|(IE)]>\n    </table>\n    </div>\n    <![endif]-->\n</div>\n</body>\n</html>\n',
    'style': "$color-header-txt: @@color-header-txt;\n$color-header-bg: @@color-header-bg;\n$color-h1-txt: @@color-h1-txt;\n$color-h2-txt: @@color-h2-txt;\n$color-h2-bg: @@color-h2-bg;\n$color-button-bg: @@color-button-bg;\n$color-button-txt: @@color-button-txt;\n$color-link-txt: @@color-link-txt;\n\n$font-family: 'Nunito', sans-serif;\n\nbody {\n    margin: 0 auto;\n    font-family: $font-family;\n    background-color: #fff;\n    a {\n        color: $color-link-txt;\n    }\n}\n\n.gte-mso-9-container {\n    margin: 20px auto;\n    width: 598px;\n    font-family: $font-family;\n    background-color: #fff;\n    border: 1px solid #d9d9d9;\n}\n\n.gte-mso-9-table-container {\n    padding: 0;\n    width: 600px;\n    margin: 0 auto;\n    font-family: $font-family;\n    font-size: 14px;\n    color: #333;\n}\n\n.main-container {\n    margin: 0 auto;\n    font-family: $font-family;\n    background-color: #fff;\n}\n\n.main-wrapper {\n    margin: 20px auto;\n    max-width: 598px;\n    font-family: $font-family;\n    background-color: #fff;\n    border: 1px solid #d9d9d9;\n    a {\n        color: $color-link-txt;\n    }\n    > table {\n        max-width: 600px;\n        margin: 0 auto;\n        font-family: $font-family;\n        font-size: 14px;\n        color: #333;\n        .content-wrapper {\n            > td {\n                &,\n                > table {\n                    background-color: #fff;\n                }\n            }\n            .header {\n                td {\n                    background-color: $color-header-bg;\n                    color: $color-header-txt;\n                    padding: 15px 20px;\n                    font-size: 14px;\n                    font-family: $font-family;\n                    text-align: center;\n                }\n                img {\n                    display: block;\n                    margin: 0px auto 10px auto;\n                    max-width: 100px;\n                }\n            }\n            .mail-title {\n                td {\n                    padding: 20px;\n                    font-family: $font-family;\n                    color: $color-h1-txt;\n                    font-size: 22px;\n                    line-height: 28px;\n                    text-align: center;\n                }\n            }\n            .mail-description {\n                td {\n                    padding: 15px 20px;\n                    font-family: $font-family;\n                    color: #333;\n                    font-size: 14px;\n                    line-height: 22px;\n                }\n                p {\n                    margin-top: 0px;\n                    padding-top: 0px;\n                }\n            }\n            .highlighted-message td {\n                background-color: $color-h2-bg;\n                padding: 15px 20px;\n                font-size: 22px;\n                color: $color-h2-txt;\n                font-family: $font-family;\n                text-align: center;\n            }\n            .cart-offer {\n                > td  {\n                    padding: 15px 20px;\n                    > p {\n                        font-size: 14px;\n                        line-height: 18px;\n                        font-family: $font-family;\n                        margin: 0px;\n                        padding: 15px 0px 10px 0px;\n                        color: #878787;\n                    }\n                }\n                th {\n                    font-family: $font-family;\n                    font-size: 14px;\n                    color: #878787;\n                    border-top: 1px solid #dfe3e6;\n                    border-bottom: 1px solid #dfe3e6;\n                    padding: 15px 5px;\n                }\n                tbody {\n                    tr:first-child {\n                        > td {\n                            border-bottom: 1px solid #dfe3e6;\n                            padding: 15px 5px;\n                            font-family: $font-family;\n                            color: #878787; font-size: 14px;\n                            text-align: center;\n                        }\n                    }\n\n                    tr:last-child {\n                        > td {\n                            padding: 20px 5px;\n                            font-family: $font-family;\n                            color: #878787;\n                            font-size: 14px;\n                            border-bottom: 1px solid #dfe3e6;\n                            &:last-child {\n                                white-space:nowrap;\n                            }\n                        }\n                    }\n                }\n                .cart-item {\n                    td:first-child {\n                        border-bottom: 1px solid #dfe3e6;\n                        padding: 15px 5px;\n                        div {\n                            width: 90px;\n                            height: 90px;\n                            overflow: hidden;\n                        }\n                        img {\n                            max-width: 90px;\n                            max-height: 90px;\n                            display: block;\n                            border-radius: 50%;\n                            border: 1px solid #d9d9d9;\n                        }\n                    }\n                    .cart-item-name a {\n                        color: $color-link-txt;\n                    }\n                }\n            }\n            .action-button {\n                > td {\n                    padding: 15px 20px;\n                }\n                table {\n                    width: auto !important;\n                    tr > td {\n                        padding: 5px 0px 8px 0px;\n                    }\n                    .button {\n                        td {\n                            font-family: $font-family;\n                            font-size: 18px;\n                            color: #fff;\n                            background-color: $color-button-bg;\n                            a {\n                                font-family: $font-family;\n                                font-size: 18px;\n                                color: $color-button-txt;\n                                background-color: $color-button-bg;\n                                text-decoration: none;\n                                border-radius: 5px;\n                                padding: 15px 40px;\n                            }\n                        }\n                    }\n                }\n            }\n            .bottom-text {\n                td {\n                    padding: 30px 20px 15px 20px;\n                    font-family: $font-family;\n                    color: #878787;\n                    font-size: 14px;\n                    line-height: 22px;\n                }\n                p {\n                    margin: 0px;\n                    padding-bottom: 15px;\n                }\n            }\n        }\n        .footer {\n            > td {\n                padding: 0px 20px 20px 20px;\n                table {\n                    border-top: 1px solid #dfe3e6;\n                    td {\n                        font-family: $font-family;\n                        font-size: 12px;\n                        color: #b5b5b5;\n                        padding-top: 30px;\n                        p {\n                            margin: 0;\n                            &:first-child {\n                                padding-bottom: 15px;\n                            }\n                            a {\n                                color: #b5b5b5;\n                                text-decoration: none;\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n}",
    'isEnabled': false,
    'id': '56af57b0bee827fedf4ae855'
  }

  var schema3 = {
    'schema': {
      'text': {
        'subject': {
          'label': 'Subject',
          'type': 'subject',
          'value': 'Elfelejtetted, mennyire vágytál erre a termékre?',
          'default': 'Elfelejtetted, mennyire vágytál erre a termékre?'
        },
        'preaheader': {
          'label': 'Pre-header',
          'type': 'input',
          'value': 'Kosarad még pár óráig él, gyere fejezd be vásárlásod most!',
          'default': 'Kosarad még pár óráig él, gyere fejezd be vásárlásod most!'
        },
        'h1': {
          'label': 'Title',
          'type': 'input',
          'value': 'Elfelejtetted, mennyire vágytál erre a termékre?',
          'default': 'Elfelejtetted, mennyire vágytál erre a termékre?'
        },
        'p1': {
          'label': 'Paragraph 1',
          'type': 'textarea',
          'requiredVariables': [
            'domain'
          ],
          'value': 'Kedves Vásárlónk! <br><br> 3 napja nálunk jártál, szeretettél volna vásárolni egy terméket, de valamilyen oknál fogva nem sikerült véglegesítened rendelésed. Tudjuk mennyire vágytál erre a termékre, így nem akarunk csalódást okozni:',
          'default': 'Kedves Vásárlónk! <br><br> 3 napja nálunk jártál, szeretettél volna vásárolni egy terméket, de valamilyen oknál fogva nem sikerült véglegesítened rendelésed. Tudjuk mennyire vágytál erre a termékre, így nem akarunk csalódást okozni:'
        },
        'h2': {
          'label': 'Highlighted Text',
          'type': 'input',
          'value': 'A rendelésed még 48 óráig végelgesítheted!',
          'default': 'A rendelésed még 48 óráig végelgesítheted!'
        },
        'cartHeader': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Ezeket hagytad 3 napja a kosaradban:',
          'default': 'Ezeket hagytad 3 napja a kosaradban:'
        },
        'cartHeaderItemDescription': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Termék leírása',
          'default': 'Termék leírása'
        },
        'cartHeaderItemPrice': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Ár',
          'default': 'Ár'
        },
        'cartHeaderItemQty': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Mennyiség',
          'default': 'Mennyiség'
        },
        'cartHeaderItemTotal': {
          'label': '',
          'type': 'hidden',
          'isImportant': false,
          'value': 'Összesen',
          'default': 'Összesen'
        },
        'cta': {
          'label': 'CTA Text',
          'type': 'input',
          'value': 'Fejezd be vásárlásod most! ',
          'default': 'Fejezd be vásárlásod most! '
        },
        'p2': {
          'label': 'Paragraph 2',
          'requiredVariables': [
            'cartLink'
          ],
          'type': 'textarea',
          'value': 'Véglegesítsd most rendelésed, hiszen kosarad csak 48 óráig tároljuk, utána véglegesen törlésre kerül!  {{cartLink}}Kattints ide, és fejezd be vásárlásod most!{{/cartLink}} <br>További szép napot kíván Neked,<br>A {{siteName}} csapata',
          'default': 'Véglegesítsd most rendelésed, hiszen kosarad csak 48 óráig tároljuk, utána véglegesen törlésre kerül!  {{cartLink}}Kattints ide, és fejezd be vásárlásod most!{{/cartLink}} <br>További szép napot kíván Neked,<br>A {{siteName}} csapata'
        },
        'footer': {
          'label': 'Footer',
          'type': 'textarea',
          'requiredVariables': [
            'siteName'
          ],
          'value': 'Ezt a levelet azért kaptad, mert elkezdtél egy vásárlást a {{siteName}} oldalán, amit végül nem fejeztél be. Ha kérdésed lenne a vásárlással kapcsolatban, keress minket bátran az alábbi elérhetőségeken:',
          'default': 'Ezt a levelet azért kaptad, mert elkezdtél egy vásárlást a {{siteName}} oldalán, amit végül nem fejeztél be. Ha kérdésed lenne a vásárlással kapcsolatban, keress minket bátran az alábbi elérhetőségeken:'
        },
        'unsubscribe': {
          'label': 'Unsubscribe',
          'type': 'hidden',
          'value': '{{unsubscribeLink}}Leiratkozás{{/unsubscribeLink}}',
          'default': '{{unsubscribeLink}}Leiratkozás{{/unsubscribeLink}}'
        }
      },
      'design': {
        'color-header-txt': {
          'label': 'Header text',
          'type': 'color-picker',
          'value': '#878787',
          'default': '#878787'
        },
        'color-header-bg': {
          'label': 'Header background',
          'type': 'color-picker',
          'value': '#f3f5f6',
          'default': '#f3f5f6'
        },
        'color-h1-txt': {
          'label': 'Title',
          'type': 'color-picker',
          'value': '#878787',
          'default': '#878787'
        },
        'color-h2-txt': {
          'label': 'Title 2',
          'type': 'color-picker',
          'value': '#2bba82',
          'default': '#2bba82'
        },
        'color-h2-bg': {
          'label': 'Title 2 background',
          'type': 'color-picker',
          'value': '#f3f5f6',
          'default': '#f3f5f6'
        },
        'color-button-bg': {
          'label': 'Button color',
          'type': 'color-picker',
          'value': '#2bba82',
          'default': '#2bba82'
        },
        'color-button-txt': {
          'label': 'Button text',
          'type': 'color-picker',
          'value': '#ffffff',
          'default': '#ffffff'
        },
        'color-link-txt': {
          'label': 'Link',
          'type': 'color-picker',
          'value': '#2bba82',
          'default': '#2bba82'
        },
        'font-family': {
          'label': '',
          'type': 'enum',
          'value': "'Nunito', sans-serif",
          'default': "'Nunito', sans-serif"
        }
      },
      'image': {
        'logo': {
          'value': 'https://static.ghostmonitor.com/email/cart-icon.png',
          'default': 'https://static.ghostmonitor.com/email/cart-icon.png'
        }
      },
      'exampleVariables': {
        'domain': '<a href="http://magfitpro.com">http://magfitpro.com</a>',
        'unsubscribeLink': '<a href="http://domain.com">',
        '/unsubscribeLink': '</a>',
        'cartLink': '<a href="http://domain.com">',
        '/cartLink': '</a>',
        'siteName': 'Magfitpro',
        'discount': 0
      },
      'schedule': {
        'minutes': 0,
        'hours': 72,
        'days': 0
      }
    },
    'template': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<!-- saved from url=(0048)http://email.szallas.hu/i/t9IXpDBkwzfsVHD8uBTqVA -->\n<html xmlns="http://www.w3.org/1999/xhtml">\n\n<head>\n    <title>Oops... Was there a problem checking out?</title>\n    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n\n    <style type="text/css">\n        @media only screen and (max-width: 600px) {\n            table {\n                width: 100% !important;\n            }\n\n            td[class=center] {\n                text-align: center !important;\n            }\n        }\n    </style>\n    <!-- inlinestyle -->\n</head>\n\n<body cz-shortcut-listen="true">\n<div class="main-container">\n    <!--[if (gte mso 9)|(IE)]>\n    <div class="gte-mso-9-container">\n        <table border="0" cellpadding="0" cellspacing="0" align="center" class="gte-mso-9-table-container">\n    <![endif]-->\n\n    <div class="main-wrapper">\n        <table border="0" cellpadding="0" cellspacing="0" align="center">\n            <tbody>\n            <!-- Content wrapper -->\n            <tr class="content-wrapper">\n                <td>\n                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">\n                        <tbody>\n                        <!-- Header -->\n                        <tr class="header">\n                            <td class="center" align="left" valign="middle">\n                                <img src="@@logo" alt="Complete Your checkout!" />\n                                <span text-bind="schema.text.preaheader"></span>\n                            </td>\n                        </tr>\n                        <!-- END Header -->\n\n                        <tr class="mail-title">\n                            <td align="center">\n                                <strong text-bind="schema.text.h1"></strong>\n                            </td>\n                        </tr>\n\n                        <tr class="mail-description">\n                            <td align="left" text-bind="schema.text.p1">\n                            </td>\n                        </tr>\n\n                        <tr class="highlighted-message">\n                            <td class="center" align="left" valign="middle" text-bind="schema.text.h2">\n                            </td>\n                        </tr>\n\n                        <!-- Cart offer -->\n                        <tr class="cart-offer">\n                            <td>\n                                <p text-bind="schema.text.cartHeader"></p>\n                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="left" class="center">\n                                    <thead>\n                                        <th></th>\n                                        <th text-bind="schema.text.cartHeaderItemDescription"></th>\n                                        <th text-bind="schema.text.cartHeaderItemPrice"></th>\n                                        <th text-bind="schema.text.cartHeaderItemQty"></th>\n                                        <th text-bind="schema.text.cartHeaderItemTotal"></th>\n                                    </thead>\n                                    <tbody>\n                                    {% for item in cart.items %}\n                                    <tr class="cart-item">\n                                        <td align="center">\n                                            <div>\n                                                <img src="{{item.imageUrl}}" alt="{{item.name}}" width="120" />\n                                            </div>\n                                        </td>\n                                        <td align="center" class="cart-item-name">\n                                            <a href="{{item.productUrl}}">{{item.name}}</a>\n                                        </td>\n                                        <td align="center">{{item.price}}</td>\n                                        <td align="center">{{item.qty}}</td>\n                                        <td align="center">{{item.qtyPrice}}</td>\n                                    </tr>\n                                    {% endfor %}\n                                    <tr>\n                                        <td colspan="4" align="right">Total:</td>\n                                        <td colspan="4" align="right" >{{cart.data.value}}</td>\n                                    </tr>\n                                    </tbody>\n                                </table>\n                            </td>\n                        </tr>\n                        <!-- END Cart offer -->\n\n                        <!-- Action button -->\n                        <tr class="action-button">\n                            <td align="right">\n                                <table align="right">\n                                    <tr>\n                                        <td align="center">\n                                            <table border="0" cellspacing="0" cellpadding="0" class="button">\n                                                <tr>\n                                                    <td align="center">\n                                                        <a href="{{cartLink}}" target="_blank" text-bind="schema.text.cta"></a>\n                                                    </td>\n                                                </tr>\n                                            </table>\n                                        </td>\n                                    </tr>\n                                </table>\n                            </td>\n                        </tr>\n                        <!-- END Action button -->\n\n                        <!-- Bottom text -->\n                        <tr class="bottom-text">\n                            <td align="left">\n                                <p text-bind="schema.text.p2"></p>\n                                <!--<p>\n                                    <span text-bind="schema.text.bye"></span>\n                                    <br/>\n                                    <span text-bind="schema.text.team"></span>\n                                </p>-->\n                            </td>\n                        </tr>\n                        <!-- END Bottom text -->\n\n                        </tbody>\n                    </table>\n                </td>\n            </tr>\n            <!-- END Content wrapper -->\n            <!-- Footer -->\n            <tr class="footer">\n                <td valign="middle" align="left">\n                    <table cellpadding="0" cellspacing="0" border="0">\n                        <tr>\n                            <td>\n                                <p text-bind="schema.text.footer"></p>\n                                <p><a href="mailto:{{site.emailSettings.senderEmail}}">{{site.emailSettings.senderEmail}}</a></p>\n                                <p text-bind="schema.text.unsubscribe"></p>\n                            </td>\n                        </tr>\n                    </table>\n\n                </td>\n            </tr>\n            <!-- END Footer -->\n            </tbody>\n        </table>\n    </div>\n    <!--[if (gte mso 9)|(IE)]>\n    </table>\n    </div>\n    <![endif]-->\n</div>\n</body>\n</html>\n',
    'style': "$color-header-txt: @@color-header-txt;\n$color-header-bg: @@color-header-bg;\n$color-h1-txt: @@color-h1-txt;\n$color-h2-txt: @@color-h2-txt;\n$color-h2-bg: @@color-h2-bg;\n$color-button-bg: @@color-button-bg;\n$color-button-txt: @@color-button-txt;\n$color-link-txt: @@color-link-txt;\n\n$font-family: 'Nunito', sans-serif;\n\nbody {\n    margin: 0 auto;\n    font-family: $font-family;\n    background-color: #fff;\n    a {\n        color: $color-link-txt;\n    }\n}\n\n.gte-mso-9-container {\n    margin: 20px auto;\n    width: 598px;\n    font-family: $font-family;\n    background-color: #fff;\n    border: 1px solid #d9d9d9;\n}\n\n.gte-mso-9-table-container {\n    padding: 0;\n    width: 600px;\n    margin: 0 auto;\n    font-family: $font-family;\n    font-size: 14px;\n    color: #333;\n}\n\n.main-container {\n    margin: 0 auto;\n    font-family: $font-family;\n    background-color: #fff;\n}\n\n.main-wrapper {\n    margin: 20px auto;\n    max-width: 598px;\n    font-family: $font-family;\n    background-color: #fff;\n    border: 1px solid #d9d9d9;\n    a {\n        color: $color-link-txt;\n    }\n    > table {\n        max-width: 600px;\n        margin: 0 auto;\n        font-family: $font-family;\n        font-size: 14px;\n        color: #333;\n        .content-wrapper {\n            > td {\n                &,\n                > table {\n                    background-color: #fff;\n                }\n            }\n            .header {\n                td {\n                    background-color: $color-header-bg;\n                    color: $color-header-txt;\n                    padding: 15px 20px;\n                    font-size: 14px;\n                    font-family: $font-family;\n                    text-align: center;\n                }\n                img {\n                    display: block;\n                    margin: 0px auto 10px auto;\n                    max-width: 100px;\n                }\n            }\n            .mail-title {\n                td {\n                    padding: 20px;\n                    font-family: $font-family;\n                    color: $color-h1-txt;\n                    font-size: 22px;\n                    line-height: 28px;\n                    text-align: center;\n                }\n            }\n            .mail-description {\n                td {\n                    padding: 15px 20px;\n                    font-family: $font-family;\n                    color: #333;\n                    font-size: 14px;\n                    line-height: 22px;\n                }\n                p {\n                    margin-top: 0px;\n                    padding-top: 0px;\n                }\n            }\n            .highlighted-message td {\n                background-color: $color-h2-bg;\n                padding: 15px 20px;\n                font-size: 22px;\n                color: $color-h2-txt;\n                font-family: $font-family;\n                text-align: center;\n            }\n            .cart-offer {\n                > td  {\n                    padding: 15px 20px;\n                    > p {\n                        font-size: 14px;\n                        line-height: 18px;\n                        font-family: $font-family;\n                        margin: 0px;\n                        padding: 15px 0px 10px 0px;\n                        color: #878787;\n                    }\n                }\n                th {\n                    font-family: $font-family;\n                    font-size: 14px;\n                    color: #878787;\n                    border-top: 1px solid #dfe3e6;\n                    border-bottom: 1px solid #dfe3e6;\n                    padding: 15px 5px;\n                }\n                tbody {\n                    tr:first-child {\n                        > td {\n                            border-bottom: 1px solid #dfe3e6;\n                            padding: 15px 5px;\n                            font-family: $font-family;\n                            color: #878787; font-size: 14px;\n                            text-align: center;\n                        }\n                    }\n\n                    tr:last-child {\n                        > td {\n                            padding: 20px 5px;\n                            font-family: $font-family;\n                            color: #878787;\n                            font-size: 14px;\n                            border-bottom: 1px solid #dfe3e6;\n                            &:last-child {\n                                white-space:nowrap;\n                            }\n                        }\n                    }\n                }\n                .cart-item {\n                    td:first-child {\n                        border-bottom: 1px solid #dfe3e6;\n                        padding: 15px 5px;\n                        div {\n                            width: 90px;\n                            height: 90px;\n                            overflow: hidden;\n                        }\n                        img {\n                            max-width: 90px;\n                            max-height: 90px;\n                            display: block;\n                            border-radius: 50%;\n                            border: 1px solid #d9d9d9;\n                        }\n                    }\n                    .cart-item-name a {\n                        color: $color-link-txt;\n                    }\n                }\n            }\n            .action-button {\n                > td {\n                    padding: 15px 20px;\n                }\n                table {\n                    width: auto !important;\n                    tr > td {\n                        padding: 5px 0px 8px 0px;\n                    }\n                    .button {\n                        td {\n                            font-family: $font-family;\n                            font-size: 18px;\n                            color: #fff;\n                            background-color: $color-button-bg;\n                            a {\n                                font-family: $font-family;\n                                font-size: 18px;\n                                color: $color-button-txt;\n                                background-color: $color-button-bg;\n                                text-decoration: none;\n                                border-radius: 5px;\n                                padding: 15px 40px;\n                            }\n                        }\n                    }\n                }\n            }\n            .bottom-text {\n                td {\n                    padding: 30px 20px 15px 20px;\n                    font-family: $font-family;\n                    color: #878787;\n                    font-size: 14px;\n                    line-height: 22px;\n                }\n                p {\n                    margin: 0px;\n                    padding-bottom: 15px;\n                }\n            }\n        }\n        .footer {\n            > td {\n                padding: 0px 20px 20px 20px;\n                table {\n                    border-top: 1px solid #dfe3e6;\n                    td {\n                        font-family: $font-family;\n                        font-size: 12px;\n                        color: #b5b5b5;\n                        padding-top: 30px;\n                        p {\n                            margin: 0;\n                            &:first-child {\n                                padding-bottom: 15px;\n                            }\n                            a {\n                                color: #b5b5b5;\n                                text-decoration: none;\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n}",
    'isEnabled': true,
    'id': '56af57d9bee827fedf4ae857'
  }

  fs.writeFileSync('./app/mockapi/json/emailSchema1.json', JSON.stringify(schema1, null, 4))
  fs.writeFileSync('./app/mockapi/json/emailSchema2.json', JSON.stringify(schema2, null, 4))
  fs.writeFileSync('./app/mockapi/json/emailSchema3.json', JSON.stringify(schema3, null, 4))
}
