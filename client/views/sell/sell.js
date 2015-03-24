Template.SellModal.rendered = function () {
  $('#sellModal').on('show.bs.modal', function (event) {
    console.log(3, 'shown');
    // var button = $(event.relatedTarget); // Button that triggered the modal
    // var currency = button.data('currency'); // Extract info from data-* attributes
    var modal = $(this);
    modal.find('.modal-title').text('Sell ' + Session.get('buyCurrency'));
    modal.find('.modal-body #currency').val(Session.get('buyCurrency'))
    modal.find('.modal-body .rate-text').text('@' + (parseFloat(Session.get('buyRate')) * 0.97).toFixed(5) + ' USD');
  });
}

Template.SellModal.events({
  'click .sell':function () {
    var count = parseFloat($('#sellModal #coinCount').val());
    var currency = $('#sellModal #currency').val();
    console.log('inputs', count, currency);
    Meteor.call('sell', currency, count, function (error, result) {
      if (error) {
        alert(error)
      } else {
        console.log(result)
      }
    })
    $('#sellModal').modal('hide');
  }
})