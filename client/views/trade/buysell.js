Template.BuySellModal.rendered = function () {
  $('#buySellModal').on('show.bs.modal', function (event) {
   console.log('in', 'shown');
   var button = $(event.relatedTarget); // Button that triggered the modal
   var currency = button.data('currency'); // Extract info from data-* attributes
   Session.set('buyCurrency', currency);
   var rate = button.data('rate'); // Extract info from data-* attributes
   Session.set('buyRate', rate);
   var modal = $(this);
   modal.find('.modal-title').text(currency);
   modal.find('.modal-body .rate').text(parseFloat(Math.round(rate * 100000) / 100000));
  })
}

Template.Trade.helpers({
  currencies: function () {
    // return Currencies.find().fetch();
    var currs = [];
    var _i = 0;
    Currencies.find().forEach(function(c) {
      c.position = _i;
      _i++;
      currs.push(c);
    });
    return currs;
  },
});

Template.CoinBlock.helpers({
  isNewRow: function () {
    return ((this.position+1) % 4 == 0)
  },
  roundedRate: function () {
     // var rt = (this.rate).toPrecision(5);
     // return parseFloat(rt).toString();
    return parseFloat(Math.round(this.rate * 100000) / 100000);
  }
});


Template.BuySellModal.helpers({
  currency: function () {
    return Session.get('buyCurrency');
  },
  rate: function () {
    return Session.get('buyRate');
  },
  increaseButtonClass: function () {
    return (Session.get('buyCurrency') === 'USD') ? 'deposit' : 'buy'
  },
  increaseButtonText: function () {
    return (Session.get('buyCurrency') === 'USD') ? 'Deposit' : 'Buy'
  },
  addDepositButton: function () {
    return (Session.get('buyCurrency') === 'USD')
  },
  isDisabled: function () {
    var disabled = "disabled";
    CustomerInfo.find({userId: Meteor.userId()}).map(function (customer) {
      if ("complete" == customer.status) {
        disabled = "";
      };
    });
    return disabled;
  }
})
