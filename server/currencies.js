/*
Meteor.startup(function () {
  var currencies = ['USD', 'BTC', 'XRP', 'LTC', 'DASH', 'DOGE', 'NXT', 'PPC', 'BTS']; // 'FTC', 'RDD', 'XPY', 'ZRC',

  _.each(currencies, function (code, index) {
    var data = Meteor.call('cryptsy/currencyMarkets', code),
        currency = {markets: []};

    currency._id = data.id;
    currency.name = data.name;
    currency.code = data.code;
    currency.order = index;
    if ((!data.markets || data.markets.length === 0) && code !== 'USD') {
      currency.maintenance = true;
    } else {
      currency.maintenance = false;
    }
    _.each(data.markets, function (market) {
      if (market.label === 'BTC/CAD' || market.label === 'BTC/EUR') {
        return;
      }
      var parties = market.label.split('/');
      currency.markets.push({
        _id: market.id,
        label: market.label,
        code: parties[0].toLowerCase()+'_'+parties[1].toLowerCase(),
        primaryCurrency: parties[0],
        secondaryCurrency: parties[1],
        ask: 1,
        bid: 1,
        maintenance: market.maintenance_mode,
        verifiedonly: market.verifiedonly,
      });
    });
    Coins.upsert({_id: currency._id}, {$set: currency});
  })

});
*/