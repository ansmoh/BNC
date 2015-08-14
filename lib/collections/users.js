
Meteor.users.helpers({
  totalBalanceInUSD: function () {
    var total = 0;
    if (Meteor.user()) {
      Transactions.find({user: this._id, status: 'complete'})
        .map(function (trn) {
          var amount = parseFloat(trn.amount);
          if (amount && trn.currency) {
            if (trn.currency === 'USD') {
              total += amount;
              //console.log(trn.currency, amount);
            } else {
              total += amount * Currencies.findOne({code:trn.currency}).rate;
              //console.log(amount, trn.currency, amount * Currencies.findOne({code:trn.currency}).rate);
            }
          }
        })
      ;
    }
    return total;
  }
})