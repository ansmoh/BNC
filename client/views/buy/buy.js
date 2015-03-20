Template.BuyModal.rendered = function () {
  $('#buyModal').on('show.bs.modal', function (event) {
    // console.log('buyModal', 'shown');
    // var button = $(event.relatedTarget); // Button that triggered the modal
    // var currency = button.data('currency'); // Extract info from data-* attributes
    // console.log('currency', button.data('currency'));
    // Session.set('buyCurrency', currency);
    // var rate = button.data('rate'); // Extract info from data-* attributes
    // console.log('rate', button.data('rate'));
    // Session.set('buyRate', rate);
    var curr = Session.get('buyCurrency'), rt = Session.get('buyRate');
    var modal = $(this);
    var amount = parseInt(modal.find('.modal-body #amount').val()) || 0;
    Session.set('buyCoins', amount); //to set initially
    modal.find('.modal-title').text('Buy request for ' + curr);
    modal.find('.modal-body #currency').val(curr);
    modal.find('.modal-body .currency-text').text(curr);
    modal.find('.modal-body .rate-text').text('@' + (parseFloat(rt) * 1.01).toFixed(5) + ' USD');
    Session.set('buyOption', true);
  })
}

Template.BuyModal.helpers({
  currency: function () {
    return Session.get('buyCurrency');
  },
  rate: function () {
    return Session.get('buyRate');
  },
  totalPrice: function () {
    if (Session.get('buyOption')) {
      var totalPrice = parseFloat(Session.get('buyCoins')) * (parseFloat(Session.get('buyRate')) * 1.01);
    }
    else{
      var totalPrice = parseFloat(Session.get('buyCoins')) / (parseFloat(Session.get('buyRate')) * 1.01);
    }
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
  },
  isBuyOption: function () {
    return Session.get('buyOption');
  }
});

Template.BuyModal.events({
  'click .buy':function (evt, template) {
    var amount = parseFloat(template.find('#buyModal #amount').value);
    if ( NaN == amount || 0 == amount){
      return;
    }

    if (Session.get('buyOption')) {
      amount = amount * (parseFloat(Session.get('buyRate')) * 1.01);
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
        template.find('#buyModal #amount').value = ''
        $('#buyModal').modal('hide')
      }
    })

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
    if (Session.get('buyOption')) {
      var tb = parseFloat(t.find('#buyModal #t-balance').innerHTML.replace(/,/g, ''));
      var coins = tb / (parseFloat(Session.get('buyRate')) * 1.01);
      t.find('#buyModal #amount').value = parseFloat(Math.round(coins * 100) / 100).toFixed(2);
    }
    else
      t.find('#buyModal #amount').value = parseFloat(t.find('#buyModal #t-balance').innerHTML.replace(/,/g, ''));
  },
  'change #buyCurrency, change #exchangeCurrency': function (e, t) {
    Session.set('buyOption', t.find('#buyModal #buyCurrency').checked)
  }
})
