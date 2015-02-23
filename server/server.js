Meteor.startup(function () {
// code to run on server at startup.
// SyncedCron.start();
  // to send mails for forgot password
  process.env.MAIL_URL = 'smtp://review321%40gmail.com:test1231@smtp.gmail.com:587';
  Accounts.emailTemplates.siteName = "BuyAnyCoin";
  Accounts.emailTemplates.from = "BuyAnyCoin Admin <admin@buyanycoin.com>";
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    url = url.replace('#/', '');
    return "Hello,\n\nTo reset your password, simply click the link below. \n\n"+url+" \n\nThanks.";
  }
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return "Please verify your email on BuyAnyCoin";
  }
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    url = url.replace('#/', '');
    return "Hello,\n\nTo verify your account email, simply click the link below. \n\n"+url+" \n\nThanks.";
  }
});

var knoxKey = '775a518965876a2b68b9ae1de6ff8fc9ed543a92'
var knoxPass = 'dd0bf99427252673aa72cf98af41d1ec26b665f3'
var authyKey = '2a7cc1467513fd1c366de7620bb9361c'

// Utility Functions
var Utility = {
  addTransaction: function (currency, amount, note, txnid) {
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
        status: 'pending',
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
      rate = currency.rate;
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
      timestamp: Date()
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
    var t_data = {
        user: Meteor.userId(),
        currency: currency,
        amount: amount,
        note: "Deposit via voucher redemption: Voucher code - '"+code+"'",
        txnid: voucherid,
        status: 'pending',
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
  }
}

Meteor.methods({
  addTransaction: function (currency, amount, note) {
    return Utility.addTransaction(currency, amount, note)
  },
  deposit: function (amount) {
    return Utility.addTransaction('USD', amount, 'Deposit')
  },
  withdraw: function (currency, amount, destination) {
    return Utility.addTransaction(currency, -amount, 'Withdraw -> ' + destination)
  },
  withdrawCoin: function (currency, amount, destination) {
    if (Utility.getTotalBalance(currency) < amount) {
      throw new Meteor.Error("insufficient-balance", 'There is not enough '+currency+' for this transaction.')
      return {
        failMessage: 'There are not enough '+currency+' for this transaction.'
      }
    }
    Utility.addTransaction(currency, -amount, 'Withdraw -> ' + destination)
    return Utility.addWithdrawRequest(currency, amount, destination)
  },
  buy: function (currency, amount) {
    check(currency, String);
    check(amount, Number);
    console.log('currency', currency);
    console.log('amount', amount);

    var rate = Utility.getRate('USD', currency);
    rate = parseFloat(rate).toFixed(5);
    console.log('rate', rate);
    var unitFee = rate * 0.1; //fee for transaction
    console.log('unitFee', unitFee);
    var cRate = parseFloat(parseFloat(rate) + parseFloat(unitFee)).toFixed(5)
    console.log('cRate', cRate);
    var quantity = Number(parseFloat(amount / cRate).toFixed(2));
    console.log('quantity', quantity);
    var totalFee = quantity * unitFee;
    console.log('totalFee', totalFee);
    var note = 'Bought ' + quantity + ' ' + currency + ' for ' + amount + ' USD @ ' + cRate;

    if (Utility.getTotalBalance('USD') < amount) {
      throw new Meteor.Error("insufficient-funds", 'There is not enough USD for this transaction.')
      return {
        failMessage: 'There are not enough USD for this transaction.'
      }
    }

    return {
      debit: Utility.addTransaction(currency, quantity, note),
      credit: Utility.addTransaction('USD', -amount, note),
      fee: Utility.depositFee('USD', totalFee, note + ' and fee is '+ totalFee)
    }
  },
  depositViaKnox: function (currency, amount, txnid) {
    return Utility.addTransaction(currency, amount, 'Deposit: Knox', txnid);
  },
  transactionDetails: function (txnID) {
    // HTTP call to knoxpayments to get the transaction_details according to the txnID
    knoxURL = 'https://knoxpayments.com/admin/api/get_payment_details.php'
    return HTTP.call("GET", knoxURL+"?trans_id="+txnID+"&API_key="+knoxKey+"&API_pass="+knoxPass);
  },
  updateCurrencyRate: function (mktID) {
    // HTTP call to cryptsy’s api to get the rate of currency
    var apiUrl = 'http://pubapi.cryptsy.com/api.php'
    return HTTP.call("GET", apiUrl+"?method=singlemarketdata&marketid="+mktID);
  },
  getBTCRate: function () {
    // HTTP call to cryptsy’s api to get the rate of currency
    var apiUrl = 'https://api.coinbase.com/v1/currencies/exchange_rates'
    return HTTP.call("GET", apiUrl);
  },
  getCalculatedRate: function (currency) {
    var rate = Utility.getRate('USD', currency);
    return rate + (rate * 0.0); //added 10 precent fee
  },
  redeemVoucher: function (voucherid, currency, amount, code) {
    return Utility.redeemVoucher(voucherid, currency, amount, code);
  },
  sendVerificationEmail: function () {
    return Accounts.sendVerificationEmail(Meteor.userId());
  },
  verifyNumber: function (phone_number) {
    // HTTP call to authy api to get token for new number verification
    var apiUrl = 'https://api.authy.com/protected/json/phones/verification/start?api_key='+authyKey
    return HTTP.call("POST", apiUrl, {data:{via: 'sms', phone_number: phone_number, country_code: 1}});
  },
  verifyToken: function (phone_number, token) {
    // HTTP call to authy api to get token verified
    var apiUrl = 'https://api.authy.com/protected/json/phones/verification/check?api_key='+authyKey
    return HTTP.call("GET", apiUrl+'&phone_number='+phone_number+'&country_code=1&verification_code='+token);
  },
  authrizeNumber: function () {
    return CustomerInfo.update({userId: Meteor.userId()}, { $set: {status: 'complete'}})
  }
})
