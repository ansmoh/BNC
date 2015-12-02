Meteor.startup(function () {
  // code to run on server at startup.
  // to send mails
  process.env.MAIL_URL = "smtp://donotreply%40buyanycoin.com:njiokmNJIOKM@smtp.gmail.com:587/";
  // process.env.SIKKA_BLOCK_IP_FOR_MILLIS = 1140000;
});



var knoxKey = '8aa796419a91eb780d954179aa21d696b204787a'
var knoxPass = '9b527490bb2bfe73097fd8314ef8ae9a0fd35301'
var authyKey = '2a7cc1467513fd1c366de7620bb9361c'
// Utility Functions
Utility = {
  addTransaction: function (currency, amount, note, txnid) {
    check(currency, String);
    check(amount, Number);
    check(note, String);
    console.log(currency);
    var status = "pending";
    if(currency === 'USD'){
      status = "complete";
    }
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in", "Must be logged in to initiate a transaction.");
    }
    var t_data = {
        user: Meteor.userId(),
        currency: currency,
        amount: amount,
        note: note,
        status: status,
        timestamp: new Date()
      };
    if( txnid !== undefined ){
      t_data.txnid = txnid;
    }
    return Transactions.insert( t_data );
  },
  addKnoxTransaction: function (currency, amount, note, txnid) {
    check(currency, String);
    check(amount, Number);
    check(note, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in", "Must be logged in to initiate a transaction.");
    }
    var t_data = {
        user: Meteor.userId(),
        currency: currency,
        amount: amount,
        note: note,
        status: 'complete',
        timestamp: Date()
      };
    if( txnid !== undefined ){
      t_data.txnid = txnid;
    }
    return Transactions.insert( t_data );
  },
  getAvailableBalance: function (currency) {
    check(currency, String)
    var availableBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: currency, status: 'complete'}).map(function(transaction) {
      availableBalance += parseFloat(transaction.amount);
    });
    return availableBalance
  },
  getTotalBalance: function (currency) {
    check(currency, String)
    var totalBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: currency}).map(function(transaction) {
      totalBalance += parseFloat(transaction.amount);
    });
    return totalBalance
  },
  getRate: function (currency1, currency2) {
    // use currency1 to buy currency2
    // eg. USD to buy BTC @ $400/BTC -> 400
    check(currency1, String);
    check(currency2, String);

    if (currency1 !== 'USD') {
      throw new Meteor.Error("bad-currency", "For now, we can only buy coins with USD.");
    }

    if (currency2 === 'USD') {
      throw new Meteor.Error("bad-currency", "For now, we can't buy USD.");
    }

    // For now, punt and say that the coin is 400
    // return 400
    var rate = 400;
    Currencies.find({code: currency2}).map(function(currency) {
      console.log('getRate', currency);
      rate = (currency.rate * 1.01);
    });
    return parseFloat(rate);
  },
  depositFee: function (currency, amount, note) {
    check(currency, String);
    check(amount, Number);
    check(note, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in", "Must be logged in to initiate a transaction.");
    }
    var txn = {
      user: Meteor.userId(),
      currency: currency,
      amount: amount,
      note: note,
      timestamp: new Date()
    };
    return CompanyLedger.insert( txn );
  },
  addWithdrawRequest: function (currency, amount, destination) {
    check(currency, String);
    check(amount, Number);
    check(destination, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in", "Must be logged in to initiate a transaction.");
    }
    var request = {
      user: Meteor.userId(),
      currency: currency,
      amount: amount,
      destination: destination,
      status : 'pending',
      timestamp: Date()
    };
    return WithdrawalRequest.insert( request );
  },
  redeemVoucher: function (voucherid, currency, amount, code) {
    check(voucherid, String);
    check(currency, String);
    check(amount, Number);
    check(code, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in", "Must be logged in to redeem a voucher.");
    }
    var user = User.findOne({userId: this.userId});
    var d = Date.now();
    if(user){
      if(_.has(user, "redeem_info") && user.redeem_info.length >= 10){
        var dates = user.redeem_info;
        console.log(dates);
        if(dates.length >= 10){
          var lastTenthDate = dates.length - 10;
          var diffMs = (d - dates[lastTenthDate]);
          var diffMins = Math.round(diffMs  / 60000);
          if(diffMins <= 30){
            throw new Meteor.Error("You can redeem only 10 vouchers in 30 minutes");
          }
        }
        else{
          User.update({userId: this.userId}, {$push: {redeem_info: d}});
        }

      }
      else{

        User.update({userId: this.userId}, {$push: {redeem_info: d}});
      }
    }
    else{
       User.insert({userId: this.userId, redeem_info: [d] });
    }
    var t_data = {
        user: Meteor.userId(),
        currency: currency,
        amount: amount,
        note: "Deposit via voucher redemption: Voucher code - '"+code+"'",
        txnid: voucherid,
        status: 'complete',
        timestamp: Date()
      };
    var txn = Transactions.insert( t_data );
    if (undefined != txn) {
      return {
        id: voucherid,
        amount: amount,
        currency: currency,
        status: Voucher.update({_id: voucherid}, { $set: {redeemed: true}})
      }
    };
  },
  saveUserInfo: function (user, bsData){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in", "Must be logged in to verify information.");
    }
    var info_obj = {firstName: user.name_first, middleName: user.name_middle, lastName: user.name_last, synapsepay: bsData};
    return User.update({userId: Meteor.userId()}, {$set: info_obj  });
  }
}

Meteor.methods({
  addTransaction: function (currency, amount, note) {
    return Utility.addTransaction(currency, amount, note)
  },
  deposit: function (amount) {
    return Utility.addTransaction('USD', amount, 'Deposit')
  },
  /*
  withdraw: function (currency, amount, destination) {
    return Utility.addTransaction(currency, -amount, 'Withdraw -> ' + destination)
  },*/
  withdrawCoin: function (currency, amount, destination) {
    if (Utility.getTotalBalance(currency) < amount) {
      throw new Meteor.Error("insufficient-balance", 'There is not enough '+currency+' for this transaction.')
      return {
        failMessage: 'There is not enough '+currency+' for this transaction.'
      }
    }
    Utility.addTransaction(currency, -amount, 'Withdraw -> ' + destination)
    return Utility.addWithdrawRequest(currency, amount, destination)
  },
  depositViaKnox: function (currency, amount, txnid) {
    return Utility.addKnoxTransaction(currency, amount, 'ACH Deposit', txnid);
  },
  transactionDetails: function (txnID) {
    // HTTP call to knoxpayments to get the transaction_details according to the txnID
    knoxURL = 'https://knoxpayments.com/admin/api/get_payment_details.php'
    return HTTP.call("GET", knoxURL+"?trans_id="+txnID+"&API_key="+knoxKey+"&API_pass="+knoxPass);
  },
  updateCurrencyRate: function (mktID) {
    // HTTP call to cryptsy’s api to get the rate of currency
    var apiUrl = 'http://pubapi.cryptsy.com/api.php';
    var result = HTTP.call("GET", apiUrl+"?method=singlemarketdata&marketid="+mktID);
    //console.log(result);
    return result;
  },
  getBTCRate: function () {
    // HTTP call to coinbase's api to get the rate of currency
    var apiUrl = 'https://api.coinbase.com/v1/currencies/exchange_rates'
    return HTTP.call("GET", apiUrl);
  },
  getCalculatedRate: function (currency) {
    var rate = Utility.getRate('USD', currency);
    return rate + (rate * 0.01); //added 10 precent fee
  },
  /*
  redeemVoucher: function (voucherid, currency, amount, code) {
    return Utility.redeemVoucher(voucherid, currency, amount, code);
  },*/
  sendVerificationEmail: function () {
    return Accounts.sendVerificationEmail(Meteor.userId());
  },
  saveUserInfo: function(userData, synapsePayData){
    return Utility.saveUserInfo(userData, synapsePayData);
  },
  resendVerificationEmail: function(){
    return Accounts.sendVerificationEmail(Meteor.userId());
  },
  sendEmail: function(sub, content){
    console.log("in send mail");
    //send mail to user
    return Email.send({
        from: 'donotreply@buyanycoin.com',
        to: Meteor.user().emails[0].address,
        subject: sub,
        text: content
      });
  },
  getNamesStatus: function(firstname, lastname){
    console.log(firstname,lastname);
    var url = "http://ofac.openach.com/api/nameSearch/api_key/CNoHeAiE5MAWBlrMdoBWUTzbGOE7TsSM7ZnaPygo7FT/first_name/"+firstname+"/last_name/"+lastname;
    return HTTP.get(url, {});
  },
  addCustomerInfo:function(fname, lname, cont){
    var data = {"firstName": fname, "lastName": lname, "contactNo": cont};
    return User.update({ userId: this.userId }, { $set:  data } );
  },
  getApiData: function(){
    var cryptsy = Meteor.npmRequire('cryptsy-api');
    var cryptsy_client = new cryptsy('1eecef9b8712fe88841c657e1f9c112417c8a336', '83255ce819e142cd46e2d3b53bcea447fa07ace75247ab51d6269d6c8d32dbd5da113d206a814947');

    cryptsy_client.makewithdrawal('1AenJytuP6en22SKWTXWDEh5BqAfd7gXSb', 5, function(e,r){
      console.log(e, r);
    })

    // var res = HTTP.post('https://api.cryptsy.com/api', {key: '83255ce819e142cd46e2d3b53bcea447fa07ace75247ab51d6269d6c8d32dbd5da113d206a814947', method: 'getApiData', address: '1AenJytuP6en22SKWTXWDEh5BqAfd7gXSb', amount: 5});
  },
  createOrder: function(){
    /*Market: DASH/BTC (ID: 155) Dash
    Market: DOGE/BTC (ID: 132) Dogecoin
    Market: NXT/BTC (ID: 159) NXT
    Market: PTS/BTC (ID: 119) Bitshares
    Market: PPC/BTC (ID: 28) Peercoin
    Market: XRP/BTC (ID: 454) Ripple
    Market: LTC/BTC (ID: 3) Litecoin
    Market: AUR/BTC (ID: 160) Auroracoin*/
    var cryptsy = Meteor.npmRequire('cryptsy-api');
    var cryptsy_client = new cryptsy('e94551a82ea6ca34b1516d3c3a574b14be6ea76d', '23baad8cf48ba905f0fa493449a344505e76f056e575cdbce24ac6793f6feb569406766a0db8d802');

    console.log('calling api');
    cryptsy_client.orderdata(3, 'sell', 5, 4.54613, function(e,r){
      console.log(e, r);
    })

  }
})
