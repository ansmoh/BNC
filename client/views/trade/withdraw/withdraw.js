Template.WithdrawModal.rendered = function () {
  $('#withdrawModal').on('show.bs.modal', function (event) {
    console.log(3, 'shown');
    var button = $(event.relatedTarget); // Button that triggered the modal
    var currency = Session.get('modalCurrency'); // Extract info from data-* attributes
    var modal = $(this);
    modal.find('.modal-title').text('Withdrawal request for ' + currency);
  });
}

Template.WithdrawModal.events({
  'click .withdraw':function () {
    var count = parseFloat($('#withdrawModal #coinCount').val());
    var wAdd = $('#withdrawModal #wAddress').val();
    if( !isPositiveInteger(count)){
      toastr.error("amount should be postive number.");
      return;
    }
    Meteor.call('withdrawCoin', Session.get('modalCurrency'), count, wAdd, function (error, result) {
      if (error) {
        alert(error)
      } else {
        console.log(result)
      }
    })
    $('#withdrawModal').modal('hide');
  }
})