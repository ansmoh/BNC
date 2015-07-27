Template.BuySellModal.rendered = function () {
  var table;
  $('#buySellModal').on('show.bs.modal', function (event) {
    console.log('in', 'shown');
    var button = $(event.relatedTarget); // Button that triggered the modal
    var currency = button.data('currency'); // Extract info from data-* attributes
    Session.set('modalCurrency', currency);
    var name = button.data('name'); // Extract info from data-* attributes
    Session.set('modalCurrencyName', name);
    var rate = button.data('rate'); // Extract info from data-* attributes
    Session.set('modalRate', rate);
    var active = button.data('active'); // Extract info from data-* attributes
    Session.set('isCurrencyActive', active);
    var modal = $(this);
    //modal.find('.modal-title').text(currency +" - "+ name);
    //modal.find('.modal-body .rate').text(parseFloat(Math.round(rate * 100000) / 100000));
    if (!active) {
      toastr.error('Currency '+ Session.get('modalCurrency') +' is inactive. Please wait until it is activated again or contact support.', 'Currency Inactive');
    };
  
    setTimeout(function () {
      if ($('#currencytxns').html() !== undefined) {
        table = $('#currencytxns').DataTable({
          retrieve: true,
          searching: false,
          pageLength: 10,
          lengthChange: false,
          ordering: false
        });
      };
    }, 100);

  })

  $('#buySellModal').on('show.bs.modal', function (event) {
    if (table) {
      table.destroy()
    };
  })
}

Template.Trade.helpers({
  currencies: function () {
    // return Currencies.find().fetch();
    var currs = [];
    var _i = 0;
    Currencies.find({}, {sort: {active: -1, sortOrder: 1}}).forEach(function(c) {
      c.position = _i;
      _i++;
      currs.push(c);
    });
    return currs;
  },
  selectedCurrency: function () {
    return Currencies.findOne(TemplateVar.get('currencyId'));
  }
});

Template.Trade.events({
  'click a.panel-heading': function (event, tmpl) {
    TemplateVar.set(tmpl, 'currencyId', this._id);
  }
})

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
  currencyBalance: function () {
    var totalBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: Session.get('modalCurrency')}).map(function(transaction) {
      if( !isNaN(transaction.amount) ){
        totalBalance += parseFloat(transaction.amount)
      }
    });
    console.log(totalBalance);
    Session.set('modelBalance', totalBalance);
    return parseFloat(Math.round(totalBalance * 100000)/100000).toString()
  },
  haveBalance: function () {
    var balance = 0;
    Transactions.find({user: Meteor.userId(), currency: 'USD'}).map(function(transaction) {
      balance += parseFloat(transaction.amount)
    });
    return balance > 0 ? true : false;
  },
  exchangeBalance: function () {
    if (this.currency && this.currency.rate) {
      return (parseFloat(Session.get('modelBalance'))*parseFloat(this.currency.rate)).toFixed(2);
    }
  },
  /*
  currency: function () {
    return Session.get('modalCurrency');
  },*/
  rate: function () {
    console.log(this.currencyObject);
    return Session.get('modalRate');
  },
  transactions: function () {
    return Transactions.find({user: Meteor.userId(), currency: Session.get('modalCurrency')}, {sort: {timestamp: -1}}).fetch();
  },
  increaseButtonClass: function () {
    return (Session.get('modalCurrency') === 'USD') ? 'deposit' : 'buy'
  },
  increaseButtonText: function () {
    return (Session.get('modalCurrency') === 'USD') ? 'Deposit' : 'Buy'
  },
  addDepositButton: function () {
    return (Session.get('modalCurrency') === 'USD')
  },
  isDisabled: function () {
    var disabled = "disabled";
    User.find({userId: Meteor.userId()}).map(function (customer) {
      if ("complete" == customer.status) {
        disabled = "";
      };
    });
    return disabled;
  },
  activeClass: function () {
    return Currencies.find({code: Session.get('modalCurrency')}).map(function (currency) {
      return currency.active ? 'on' : 'busy'
    })
  },
  isInactive: function () {
    return Currencies.find({code: Session.get('modalCurrency')}).map(function (currency) {
      if (currency.active) {
        return ''
      };
      return 'disabled'
    })
  },
  getDesc: function () {
    return Currencies.find({code: Session.get('modalCurrency')}).map(function (currency) {
      if (currency.desc && currency.desc != "") {
        return currency.desc
      };
      return 'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish.'
    })
  },
  modalCurrencyUSD: function(){
    return Session.equals('modalCurrency', "USD");
  }
})

Template.BuySellModal.events({
  'click .no-balance': function (e, t){
    toastr.success('To do that please make a deposit', 'Information')
    window.location.href = '/deposit'
  },
  'click #showToast': function(){
    toastr.error("withdraws are coming soon.");
  }
})

Template.TransactionDetail.helpers({
  colorClass: function () {
    return (this.amount > 0)? 'success': 'danger';
  },
  datetime: function () {
    var date = new Date(this.timestamp);
    var options = {
      weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    return date.toLocaleTimeString("en-us", options)
  }
});

Template.TransactionHistory.rendered = function () {
  setTimeout(function () {
    $('#transactions').DataTable({
      searching: false,
      pageLength: 20,
      lengthChange: false,
      ordering: false
    });
  }, 100);
}

Template.TransactionHistory.helpers({
  alltransactions: function () {
    var Txns = [], _i = 1;
    Transactions.find({}, {sort: {timestamp: -1}}).forEach(function (t){
      t.pos = _i++; Txns.push(t);
    });    
    return Txns;
  }
});

Template.TransactionHistoryDetail.rendered = function () {
  $('.label').tooltip();
}

Template.TransactionHistoryDetail.helpers({
  colorClass: function () {
    return (this.amount > 0)? 'success': 'danger';
  },
  labelColorClass: function () {
    return (this.currency == "USD" && this.status == "complete")? 'success': 'warning';
  },
  statusText: function () {
    return (this.currency != "USD")? 'pending': this.status;
  },
  title: function () {
    return (this.currency == "USD" && this.status == "complete")? 'Completed': 'Your transaction is pending and will be completed as soon as possible'
  },
  datetime: function () {
    var date = new Date(this.timestamp);
    var options = {
      weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    return date.toLocaleTimeString("en-us", options)
  }
});
