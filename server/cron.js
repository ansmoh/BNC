Meteor.startup(function () {
  SyncedCron.start();
});

// Cryptsy Ticker, every 30 secs
SyncedCron.add({
  name: 'Cryptsy Ticker',
  schedule: function (parser) {
    return parser.text('every 30 s');
  },
  job: function () {
    Currencies.find().forEach(function (currency) {
      _.each(_.pluck(currency.markets, '_id'), function (marketId) {
        var ticker = Meteor.call('cryptsy/ticker', marketId);
        console.log(ticker)
        Currencies.update(
          {_id: currency._id, 'markets._id': marketId},
          {$set: {'markets.$.ask': ticker.ask,'markets.$.bid': ticker.bid}}
        )
      })
    })
  }
})
