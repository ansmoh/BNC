currency = new SimpleSchema({
  code: {
    type: String
  },
  name: {
    type: String
  },
  rate: {
    type: Number,
    decimal: true
  },
  btcRate: {
    type: Number,
    decimal: true,
    optional: true
  },
  desc: {
    type: String,
    optional: true
  },
  marketid: {
    type: Number,
    optional: true
  },
  sortOrder: {
    type: Number
  },
  active: {
    type: Boolean,
    defaultValue: true
  }
})

Currencies = new Mongo.Collection('currencies');
Currencies.attachSchema(currency);

Currencies.helpers({
  balance: function () {
    var balance = 0;
    Transactions.find({user: Meteor.userId(), currency: this.code})
      .map(function (transaction) {
        var amount = parseFloat(transaction.amount);
        if (amount) {
          balance += amount;
        }
      });
    return balance;
  },
  price: function () {
    if (_.contains([155,132,159,119,28,454,160,3], this.marketid) && this.btcRate) {
      return this.btcRate;
    } else {
      return this.rate;
    }
  },
  buyPrice: function () {
    if (_.contains([155,132,159,119,28,454,160,3], this.marketid) && this.btcRate) {
      return this.btcRate * (1 + this.buyFee());
    } else {
      return this.rate * (1 + this.buyFee());
    }
  },
  sellPrice: function () {
    if (_.contains([155,132,159,119,28,454,160,3], this.marketid) && this.btcRate) {
      return this.btcRate * (1 - this.sellFee());
    } else {
      return this.rate * (1 - this.sellFee());
    }
  },
  buyFee: function () {
    return 1 / 100;
  },
  sellFee: function () {
    return 3 / 100;
  }
});