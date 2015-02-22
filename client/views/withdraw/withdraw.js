Template.WithdrawModal.rendered = function () {
  $('#withdrawModal').on('show.bs.modal', function (event) {
    console.log(3, 'shown');
    var button = $(event.relatedTarget); // Button that triggered the modal
    var currency = button.data('currency'); // Extract info from data-* attributes
    var modal = $(this);
    modal.find('.modal-title').text('Withdrawal request for ' + currency);
    modal.find('.modal-body #currency').val(currency)
  });
}

Template.WithdrawModal.events({
  'click .withdraw':function () {
    var count = parseFloat($('#withdrawModal #coinCount').val());
    var currency = $('#withdrawModal #currency').val();
    var wAdd = $('#withdrawModal #wAddress').val();
    console.log('inputs', count, currency, wAdd);
    // var cryptedAdd = CryptoJS.SHA256(wAdd).toString(); SHA 256 string for Wallet address
    console.log('inputs', count, currency, wAdd);
    Meteor.call('withdrawCoin', currency, count, wAdd, function (error, result) {
      if (error) {
        alert(error)
      } else {
        console.log(result)
      }
    })
    $('#withdrawModal').modal('hide');
  }
})