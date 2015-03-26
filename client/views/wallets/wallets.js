Template.Wallets.helpers({
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
  total: function () {
    var totalBalance = 0;
    var rates = {};
    Currencies.find().forEach(function(c) {
      rates[c.code] = c.rate;
    });
    Transactions.find({user: Meteor.userId()}).map(function(transaction) {
      totalBalance += (parseFloat(transaction.amount) * parseFloat(rates[transaction.currency]));     
    });
    totalBalance = parseFloat(Math.round(totalBalance * 100) / 100).toFixed(2);
    return VMasker.toMoney(totalBalance, {separator: '.', delimiter: ','});
  }
});

Template.Wallet.helpers({
  isNewRow: function () {
    return ((this.position+1) % 4 == 0)
  },
  roundedRate: function () {
    if (this.code == "USD") {
      return parseFloat(Math.round(this.rate * 100) / 100).toFixed(2);
    };
    return parseFloat(Math.round(this.rate * 1000000) / 1000000).toFixed(6);
  }
})

Template.TransactionHistory.helpers({
  alltransactions: function () {
    return Transactions.find({}, {sort: {timestamp: -1}}).fetch();    
  },
});

Template.TransactionHistoryDetail.helpers({
  colorClass: function () {
    return (this.amount > 0)? 'success': 'danger';
  },
  labelColorClass: function () {
    return (this.status == "pending")? 'warning': 'success';
  }
});