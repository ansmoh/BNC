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
});

Template.Wallet.helpers({
  isNewRow: function () {
    return ((this.position+1) % 4 == 0)
  },
  roundedRate: function () {
    return parseFloat(Math.round(this.rate * 100000) / 100000);
  }
})
