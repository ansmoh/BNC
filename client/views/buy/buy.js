Template.BuyModal.rendered = function () {
  $('#buyModal').on('show.bs.modal', function (event) {
    console.log('aa', 'shown');
    var button = $(event.relatedTarget); // Button that triggered the modal
    var currency = button.data('currency'); // Extract info from data-* attributes
    Session.set('buyCurrency', currency);
    var rate = button.data('rate'); // Extract info from data-* attributes
    Session.set('buyRate', rate);
    var modal = $(this);
    var amount = parseInt(modal.find('.modal-body #amount').val()) || 0;
    Session.set('buyCoins', amount); //to set initially
    modal.find('.modal-title').text('Buy request for ' + currency);
    modal.find('.modal-body #currency').val(currency);
    modal.find('.modal-body .currency-text').text(currency);
    modal.find('.modal-body .rate-text').text('@' + (parseFloat(rate) * 1.01).toFixed(5) + ' USD');
  })
}

Template.BuyModal.helpers({
  totalPrice: function () {
    var totalPrice = parseFloat(Session.get('buyCoins')) / (parseFloat(Session.get('buyRate')) * 1.01);
    return parseFloat(Math.round(totalPrice * 100) / 100).toFixed(2);
  },
  balance : function () {
    var totalBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: 'USD'}).map(function(transaction) {
      console.log(totalBalance, transaction.amount)
      totalBalance += parseFloat(transaction.amount)
    });
    totalBalance = parseFloat(totalBalance).toFixed(2);
    return VMasker.toMoney(totalBalance, {separator: '.', delimiter: ','});
  }
});

Template.BuyModal.events({
  'click .buy':function (evt, template) {
    var amount = parseFloat(template.find('#buyModal #amount').value);
    if ( NaN == amount || 0 == amount){
      return;
    }

    var currency = template.find('#buyModal #currency').value;
    console.log('inputs', amount, currency);
    //Request to server
    Meteor.call('buy', currency, amount, function (error, result) {
      if (error) {
        console.log(error)
        alert(error)
      } else {
        console.log(result)
      }
    })

    $('#buyModal').modal('hide');
  },
  'propertychange #amount, change #amount, click #amount, keyup #amount, input #amount, paste #amount': function (evt, template) {
    var amount = template.find('#amount').value;
    if ('' == amount || 0 == amount){
      Session.set('buyCoins', 0);
    }
    else{
      Session.set('buyCoins', amount);
    }
  },
  'click .buy-max':function(e, t){
    t.find('#buyModal #amount').value = parseFloat(t.find('#buyModal #t-balance').innerHTML.replace(/,/g, ''));
  }
})
