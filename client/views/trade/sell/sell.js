Template.SellModal.rendered = function () {
  $('#sellModal').on('show.bs.modal', function (event) {
    console.log(3, 'shown');
    // var button = $(event.relatedTarget); // Button that triggered the modal
    // var currency = button.data('currency'); // Extract info from data-* attributes
    var modal = $(this);
    var coins = parseInt(modal.find('.modal-body #coins').val()) || 0;
    Session.set('sellCoins', coins); //to set initially
    modal.find('.modal-title').text('Sell ' + Session.get('modalCurrency'));
    modal.find('.modal-body #currency').val(Session.get('modalCurrency'))
    modal.find('.modal-body .rate-text').text('@' + (parseFloat(Session.get('modalRate')) * 0.98).toFixed(5) + ' USD');
  });
}

Template.SellModal.helpers({
  balance: function(){
    var balance = 0
    Transactions.find({currency: Session.get('modalCurrency')}).map(function(transaction){
      balance += parseFloat(transaction.amount)
    })
    Session.set('coinsBalance', balance)
    return balance
  },
  valueInUSD: function () {
    return (parseFloat(Session.get('sellCoins')) * parseFloat(Session.get('modalRate')) * 0.98).toFixed(5)
  },
  fee: function () {
    return (parseFloat(Session.get('sellCoins')) * parseFloat(Session.get('modalRate')) * 0.01).toFixed(5)
  }
});

Template.SellModal.events({
  'click .sell': function (e, t) {
    var count = parseFloat(t.find('#coins').value);
    console.log('inputs', count, Session.get('modalCurrency'));
    Meteor.call('sell', currency, count, function (error, result) {
      if (error) {
        alert(error)
      } else {
        console.log(result)
      }
    })
    $('#sellModal').modal('hide');
  },
  'propertychange #coins, change #coins, click #coins, keyup #coins, input #coins, paste #coins': function (e, t) {
    var coins = t.find('#coins').value;
    if ('' == coins || 0 == coins){
      Session.set('sellCoins', 0);
    }
    else{
      Session.set('sellCoins', coins);
    }
    console.log('coins changed')
  },
  'click .sell-all':function(e, t){
    t.find('#coins').value = parseFloat(Session.get('coinsBalance'));

    Session.set('sellCoins', Session.get('coinsBalance'));
  }
});