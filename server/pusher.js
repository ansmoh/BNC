/*
var util = Meteor.npmRequire('util');
var CryptsyAPI = Meteor.npmRequire('cryptsyv2-api');
var cryptsy = new CryptsyAPI(Meteor.settings.cryptsy.publicKey, Meteor.settings.cryptsy.secretKey);

(function cryptsyPushListener() {
  cryptsy.markets(Meteor.bindEnvironment(function(err, markets) {
    if(err) return;

    if(markets.success) {
      var marketIDs = markets.data.reduce(function(all, market) {
        all.push(market.id);
        return all;
      }, [])

      cryptsy.subscribe(marketIDs, 'ticker');
      //cryptsy.subscribe(marketIDs, 'trade');

      cryptsy
        .on('ticker', Meteor.bindEnvironment(function (ticker) {
          //console.log(util.format("Ticker: %s Sell: %d@%d Buy: %d@%d", ticker.trade.marketid, ticker.trade.topsell.quantity, ticker.trade.topsell.price, ticker.trade.topbuy.quantity, ticker.trade.topbuy.price))
          if (ticker.trade.marketid == 3) {
            Markets.upsert(
              {_id: ticker.trade.marketid},
              {
                $set: {
                  //'topsell.price': parseFloat(ticker.trade.topsell.price),
                  //'topsell.quantity': parseFloat(ticker.trade.topsell.quantity),
                  //'topbuy.price': parseFloat(ticker.trade.topbuy.price),
                  //'topbuy.quantity': parseFloat(ticker.trade.topbuy.quantity),
                  //_id: ticker.trade.marketid,
                  topsell: {
                    price: parseFloat(ticker.trade.topsell.price),
                    quantity: parseFloat(ticker.trade.topsell.quantity)
                  },
                  topbuy: {
                    price: parseFloat(ticker.trade.topbuy.price),
                    quantity: parseFloat(ticker.trade.topbuy.quantity)
                  },
                  timestamp: ticker.trade.timestamp,
                  datetime: ticker.trade.datetime
                }
              }
            );
          }
        }))
        //.on('trade', function(trade) {
          //console.log(util.format("Trade: %s %s %d@%d total %d", trade.trade.marketid, trade.trade.type, trade.trade.quantity, trade.trade.price, trade.trade.total))
        //});
    }
  }));
})();*/