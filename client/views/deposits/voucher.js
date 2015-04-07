Template.VoucherModal.rendered = function () {
  var next = 1;
  var success = false;
  $('#voucherModal').on('show.bs.modal', function (event) {
    $('.status-text').text('');
    $(".add-more").click(function(e){
      e.preventDefault();
      var addto = "#fieldGroup1"
      next = next + 1;
      var newField = $('<div class="form-group" id="fieldGroup' + next + '"><div class="input-group"><input type="text" class="form-control voucher-code" id="voucherCode' + next + '" placeholder="Voucher Code"><span class="input-group-btn"><button type="button" id="remove' + next + '" class="btn btn-danger remove-me" title="Remove">Remove</button></span></div><span class="status-text" id="status-text'+next+'"></span></div>');
      $(addto).after(newField);
      $("#voucherCode" + next).attr('data-source', $("#voucherCode" + (next-1)).attr('data-source'));

      $('.remove-me').click(function(e){
        e.preventDefault();
        var fieldNum = this.id.replace('remove', '');
        var fieldID = "#fieldGroup" + fieldNum;
        $(fieldID).remove();
      });
    });
  });

  $('#voucherModal').on('hide.bs.modal', function (event) {
    for (var i = next; i > 1; i--) {
        var fieldID = "#fieldGroup" + i;
        $(fieldID).remove();
    };
    next = 1;
    $('.voucher-code').val('');
    $("#fieldGroup"+next).removeClass('has-error').removeClass('has-success');
    $(".add-more").unbind('click');
    if(success)
      window.location = '/balances'
  });
}

Template.VoucherModal.events({
  'click .voucher':function (e, t) {
    $('.status-text').text('');
    var vouchers = Voucher.find().fetch();
    var fields = $('.voucher-code');
    for (var j = 0; j < fields.length; j++) {
      var code = fields[j].value;
      var num = fields[j].id.replace('voucherCode', '');
      // console.log('codes', code, num);
      var found = false;
      for (var i = vouchers.length - 1; i >= 0; i--) {
        if(vouchers[i].code == code){
          found = true;
          if(!vouchers[i].activated){
            $('#status-text'+num).text('Sorry, this voucher has not been activated yet.');
            $("#fieldGroup"+num).addClass('has-error');
            break;
          }
          if(vouchers[i].redeemed){
            $('#status-text'+num).text('Sorry, This voucher is already redeemed.');
            $("#fieldGroup"+num).addClass('has-error');
            break;
          }
          $("#fieldGroup"+num).addClass(vouchers[i]._id);
          Meteor.call('redeemVoucher', vouchers[i]._id, vouchers[i].currency, vouchers[i].amount, vouchers[i].code, function (error, result) {
            // console.log(result)
            if (error) {
              alert(error)
            } else {
              $('.' + result.id + ' .status-text').text('Congrats!! You voucher has been redeemed for '+ result.amount +' '+ result.currency +'!!!');
              $('.' + result.id).addClass('has-success');
              success = true;
              var content = 'Hello '+Meteor.user().emails[0].address+',\n\nCongrats!! You voucher has been redeemed for '+ result.amount +' '+ result.currency +'! \n\nThanks.'
              Meteor.call('sendEmail', 'BuyAnyCoin: Voucher redeemed', content, function(err, res){
                if (err) {
                  console.log(err)
                  toastr.error(err.reason, 'Mail not sent')
                } else {
                  console.log("Mail send successfully ")
                }
              })
            }
          })
          break;
        }
      };
      if (!found && i < 0) {
        $('#status-text'+num).text('Sorry, this code is not in our system');
        $("#fieldGroup"+num).addClass('has-error');
      };
    };
  }
})