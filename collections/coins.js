
Coins = new Mongo.Collection('coins');

Coins.helpers({

  price: function (code, format) {
    var price = 0,
        marketCode = this.code.toLowerCase() + '_' + code.toLowerCase(),
        format = format || '0,0.00000000';

    if (this.code === 'USD') {
      price = 1;
    }
    if ((market = _.findWhere(this.markets, {code: marketCode}))) {
      price = market.bid;
    }
    return numeral(price).format(format);
  },

})