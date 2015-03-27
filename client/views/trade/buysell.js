Template.BuySellModal.rendered = function () {
  $('#buySellModal').on('show.bs.modal', function (event) {
    console.log('in', 'shown');
    var button = $(event.relatedTarget); // Button that triggered the modal
    var currency = button.data('currency'); // Extract info from data-* attributes
    Session.set('buyCurrency', currency);
    var rate = button.data('rate'); // Extract info from data-* attributes
    Session.set('buyRate', rate);
    var active = button.data('active'); // Extract info from data-* attributes
    Session.set('isCurrencyActive', active);
    var modal = $(this);
    modal.find('.modal-title').text(currency);
    modal.find('.modal-body .rate').text(parseFloat(Math.round(rate * 100000) / 100000));
    if (!active) {
      toastr.error('Currency '+ Session.get('buyCurrency') +' is inactive for some reasons. Please wait until it is activated again or contact support.', 'Currency Inactive');
    };
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
  activeClass: function () {
    return this.active ? 'on' : 'busy'
  },
  roundedRate: function () {
     // var rt = (this.rate).toPrecision(5);
     // return parseFloat(rt).toString();
    if (this.code == "USD") {
      return parseFloat(Math.round(this.rate * 100) / 100).toFixed(2);
    };
    return parseFloat(Math.round(this.rate * 1000000) / 1000000).toFixed(6);
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
  },
  activeClass: function () {
    return Currencies.find({code: Session.get('buyCurrency')}).map(function (currency) {
      return currency.active ? 'on' : 'busy'
    })
  },
  isInactive: function () {
    return Currencies.find({code: Session.get('buyCurrency')}).map(function (currency) {
      if (currency.active) {
        return ''
      };
      return 'disabled'
    })
  },
  getDesc: function () {
    return Currencies.find({code: Session.get('buyCurrency')}).map(function (currency) {
      if (currency.desc && currency.desc != "") {
        return currency.desc
      };
      return 'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish.'
    })
  }
})
