'use strict'
/* global $, _ */

$(document).ready(function () {
  var $button = $('#button')
  var $input = $('#input')
  var $mEmail = $('#mEmail')
  var $modal = $('#modal')
  var $form = $('#form')

  $form.validator().on('submit', function (e) {
    if (e.isDefaultPrevented()) {
      // handle the invalid form...
    } else {
      var array = $form.serializeArray()
      var data = _.object(_.pluck(array, 'name'), _.pluck(array, 'value'))

      $.post('http://sites-dev.ghostmonitor.com/auth/register', data, function (data) {
        window.location.replace('https://gm-app-staging.s3.amazonaws.com/index.html#/wizard/' + data.token)
      })
    }
    return false
  })

  $button.on('click', function () {
    $mEmail.val($input.val())
    $modal.modal({
      backdrop: 'static',
      keyboard: false
    })
  })
})
