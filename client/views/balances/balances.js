Template.Balances.helpers({
  currencies: function () {
    return Currencies.find().fetch();
  },
});

Template.Balance.helpers({
  totalBalance: function () {
    var totalBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: this.code}).map(function(transaction) {
      console.log(totalBalance, transaction.amount)
      totalBalance += parseFloat(transaction.amount)
    });
    if ("USD" == this.code) {
      totalBalance = parseFloat(Math.round(totalBalance * 100) / 100).toFixed(2);
      return VMasker.toMoney(totalBalance, {separator: '.', delimiter: ','});
    };
    return totalBalance
  },
  pendingBalance: function () {
    var pendingBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: this.code, status: 'pending'}).map(function(transaction) {
      pendingBalance += transaction.amount
    });
    return pendingBalance
  },
  availableBalance: function () {
    var availableBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: this.code, status: 'complete'}).map(function(transaction) {
      availableBalance += parseFloat(transaction.amount)
    });
    return availableBalance
  },
  increaseButtonClass: function () {
    return (this.code === 'USD') ? 'deposit' : 'buy'
  },
  increaseButtonText: function () {
    return (this.code === 'USD') ? 'Deposit' : 'Buy'
  },
  addDepositButton: function () {
    return (this.code === 'USD')
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
  isVerified: function () {
    return CustomerInfo.find().fetch()[0].status === 'complete'
  }
});

Template.Balance.events({
  'click .buy': function (e, t) {
    var amount = parseInt(t.find('.amount').value, 10);
    if ( NaN == amount || 0 == amount) {
      return;
    }
    Meteor.call('buy', this.code, amount, function (error, result) {
      if (error) {
        console.log(error)
        alert(error)
      } else {
        console.log(result)
      }
    })
  },
  'click .withdraw': function () {  //not in use now
    Meteor.call('addTransaction', 'USD', 11.50, 'Test Tran', function (error, result) {
      if (error) {
        alert('error')
      } else {
        console.log(result)
      }
    })
  },
  'click .confirm-pending': function () {
    Transactions.update({user: Meteor.userId(), currency: 'USD', amount: 10.0, note: 'deposit', status: 'pending', timestamp: Date()})
    Transactions.update({
      user: 'USD',
      currency: 'USD'
    }, {
      $set: {status: "complete"}
    });
  },
});
