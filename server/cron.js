Meteor.startup(function () {
  // code to run on server at startup
  //SyncedCron.start();
});

// Cryptsy Ticker, every 30 secs
SyncedCron.add({
  name: 'Cryptsy Ticker',
  schedule: function (parser) {
    return parser.text('every 30 s');
  },
  job: function () {
    Coins.find().map(function (currency) {
      _.each(_.pluck(currency.markets, '_id'), function (marketId) {
        var ticker = Meteor.call('cryptsy/ticker', marketId);
        Coins.update(
          {_id: currency._id, 'markets._id': marketId},
          {$set: {'markets.$.ask': ticker.ask,'markets.$.bid': ticker.bid}}
        )
      })
    })
  }
})

// Cron Job to check the Transaction collection every minute,
// get the knox transaction details according to transaction id and update the status accordingly
SyncedCron.add({
  name: 'Update the knoxpayment status according to transaction details',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 minute');
  },
  job: function() {
    // console.log("In Sync Job");
    Transactions.find({status: 'pending'}).map(function(transaction) {
      // console.log("Transaction Id");
      // console.log(transaction.txnid);

      if(transaction.txnid !== undefined){
         Meteor.call("transactionDetails", transaction.txnid, function(error, results) {
           // console.log(results);
            var paymentDetails = results.data.GetPaymentDetails; // Knoxpayment respnse for transaction_details
            // console.log("Transaction Details");
            // console.log(paymentDetails);
            if( paymentDetails.error_code === "null" )  // If no error returned then proceed for database call
            {
              var status = "pending";
              switch(paymentDetails.status_code){
                case 'executed' :
                  status = "complete";
                break;
                case 'queued' :
                  status = "pending";
                break;
                case 'cancelled' :
                  status = "cancelled";
                break;
              }
              Transactions.update({_id: transaction._id}, {$set:{status: status}})
            }
         });
      }
    });
  }
});

// Cron Job to check the rates of currency in every 5 minutes,
SyncedCron.add({
  name: 'Update the rates of currencies with api',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 30 s');
  },
  job: function() {
    // console.log("In rate update");
    Currencies.find().map(function(currency) {
      console.log("currency", currency.code);

      if(currency.code !== "USD"){
        Meteor.call("getBTCRate", function(error, exchangeRates){
          var btcRate = exchangeRates.data.btc_to_usd * 1.01; //to increase rate by 1 percent
          if(currency.code == "BTC"){
            Currencies.update({_id: currency._id}, {$set:{rate: btcRate, "btcRate": 1}});
            CurrencyRateLog.insert({currency: currency.code, rate: btcRate, btcRate: 1, timestamp: Date()})
          }
          else if(currency.code == "BTS"){
            return;
          }
          else{
            var mktId = 0;
            switch(currency.code){
              case 'LTC' :
                mktId = 3;
                break;

              case 'DASH' :
                mktId = 155;
                break;

              case 'DOGE' :
                mktId = 132;
                break;

              case 'NXT' :
                // mktId = 279; //agaisnt USD
                mktId = 159; //against BTC
                break;

              case 'XRP' :
                // mktId = 442;
                mktId = 454;
                break;

              // case 'BTS' : //Not found on cryptsy
              //   mktId = 132;
              //   break;

              case 'PPC' :
                // mktId = 305;
                mktId = 28;
                break;
            }
            Meteor.call("updateCurrencyRate", mktId, function(error, results) {
              var code = currency.code;
              if(undefined === results || !results || !results.data || !results.data.success){
                return;
              }
              if (currency.code === 'DASH') {
                code = 'DRK';
              }
              var priceInBtc = parseFloat(results.data["return"]["markets"][code]["lasttradeprice"]);
              var priceInUsd = priceInBtc * btcRate;
              Currencies.update({_id: currency._id}, {$set:{rate: priceInUsd, btcRate: priceInBtc}});
              CurrencyRateLog.insert({currency: currency.code, rate: priceInUsd, btcRate: priceInBtc, timestamp: new Date()})
            });
          }
        });
      }
    });
  }
});
