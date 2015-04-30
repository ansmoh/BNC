Meteor.startup(function () {
  // code to run on server at startup.
  // to send mails
  // process.env.MAIL_URL = "smtp://donotreply%40buyanycoin.com:njiokmNJIOKM@smtp.gmail.com:587/";
  Accounts.emailTemplates.siteName = "BuyAnyCoin";
  Accounts.emailTemplates.from = "BuyAnyCoin <donotreply@buyanycoin.com>";
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    url = url.replace('#/', '');
    return "Hi!,\n\nLooks like you forgot your password, no worries. Just click the link below to setup a new one. \n\n"+url+" \n\nThank you,\n\n BuyAnyCoin Team";
  }
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return "Please verify your email";
  }
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    url = url.replace('#/', '');
    return "Hello,\n\nTo verify your account email, simply click the link below. \n\n"+url+" \n\n - BuyAnyCoin Team";
  }
});

Accounts.onCreateUser(function(options, user) {
  // *send mail to admin for new account
      Email.send({
       from: 'support@buyanycoin.com',
       to: 'admin@buyanycoin.com',
       subject: 'BuyAnyCoin: New account created',
       text: 'Hello Admin,\n\nWelcome the new user '+user.emails[0].address+' signed-up at '+user.createdAt+'.'
     });   
 
  // * add field to active/inactive account
 AccountStatus.insert({userId: user._id, active: true, email: user.emails[0].address});
 console.log(user);
 return user;
});

Accounts.validateLoginAttempt(function (attempt) {
  console.log('validateLoginAttempt');
  if (!attempt.allowed)
    return false;

  if(AccountStatus.find({userId: attempt.user._id}).count()){
    var res= AccountStatus.find({userId: attempt.user._id}).map(function (customer) {
      //fixture if not added
      if (undefined == customer.active) {
        AccountStatus.update({userId: customer.userId}, {$set:{active: true}});
        return true;
      };
      console.log(customer.active);
      if(customer.active){
         var user_id = attempt.user._id;
        AccountStatus.upsert({userId: user_id},{$set: {active: true, attempts: 0}})
      }
      return customer.active;
    });
    return res[0];
  }
  else{
    //fixture if user is not in AccountStatus
    AccountStatus.insert({userId: attempt.user._id, active: true, email: attempt.user.emails[0].address});
    return true;
  }
  return false;
});

//on login failure setting incrementing attempts by 1 and if attempts greater than 5 setting account as inactive for 5 minutes
Accounts.onLoginFailure(function(details){
  console.log('onLoginFailure');
  if(details && _.has(details, "user")){
    var user_id = details.user._id;
    AccountStatus.upsert({userId: user_id},{$inc: {attempts: 1}});
    var account = AccountStatus.findOne({userId: user_id});
    if(account.attempts >= 5){
      AccountStatus.update({userId: user_id},{$set: {active: false}});
      Meteor.setTimeout(function () {
        AccountStatus.update({userId: user_id},{$set: {active: true}});
      }, 5 * 60 * 1000);
    }
  }
});


var knoxKey = '8aa796419a91eb780d954179aa21d696b204787a'
var knoxPass = '9b527490bb2bfe73097fd8314ef8ae9a0fd35301'
var authyKey = '2a7cc1467513fd1c366de7620bb9361c'
var blockScoreKey = 'sk_live_fbba96096568198ffa995843f0bc51ca'
// var blockScoreKey = 'sk_test_b98fde330db2149ab12e09475ef20d3a'
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
  },
  saveUserInfo: function (user, bsData){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in", "Must be logged in to verify information.");
    }
    console.log("saveUserInfo", user, bsData);
    return CustomerInfo.update({userId: Meteor.userId()}, {$set:{firstName: user.name_first, middleName: user.name_middle, lastName: user.name_last, blockscore: bsData}});
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
        failMessage: 'There is not enough '+currency+' for this transaction.'
      }
    }
    Utility.addTransaction(currency, -amount, 'Withdraw -> ' + destination)
    return Utility.addWithdrawRequest(currency, amount, destination)
  },
  buy: function (currency, count) {
    check(currency, String);
    check(count, Number);
    console.log('currency', currency);
    console.log('count', count);

    var rate = Utility.getRate('USD', currency);
    rate = parseFloat(rate).toFixed(5);
    console.log('rate', rate);
    var unitFee = rate * 0.01; //fee for transaction
    console.log('unitFee', unitFee);
    var cRate = parseFloat(parseFloat(rate) + parseFloat(unitFee)).toFixed(5)
    console.log('cRate', cRate);
    var amount = Number(parseFloat(count * cRate).toFixed(2));
    console.log('count', count);
    var totalFee = count * unitFee;
    console.log('totalFee', totalFee);
    var note = 'Bought ' + count + ' ' + currency + ' for ' + amount + ' USD @ ' + cRate;

    if (Utility.getTotalBalance('USD') < amount) {
      throw new Meteor.Error("insufficient-funds", 'There is not enough USD for this transaction.')
      return {
        failMessage: 'There is not enough USD for this transaction.'
      }
    }

    return {
      debit: Utility.addTransaction(currency, count, note),
      credit: Utility.addTransaction('USD', -amount, note),
      fee: Utility.depositFee('USD', totalFee, note + ' and fee is '+ totalFee)
    }
  },
  sell: function (currency, count) {
    check(currency, String);
    check(count, Number);
    console.log('currency', currency);
    console.log('count', count);

    var rate = Utility.getRate('USD', currency);
    rate = parseFloat(rate).toFixed(5);
    console.log('rate', rate);
    rate = rate * 0.98; //2% down for selling
    var unitFee = rate * 0.01; //fee for transaction
    console.log('unitFee', unitFee);
    var cRate = parseFloat(parseFloat(rate) - parseFloat(unitFee)).toFixed(5)
    console.log('cRate', cRate);
    var amount = Number(parseFloat(count * cRate).toFixed(2));
    console.log('amount', amount);
    var totalFee = count * unitFee;
    console.log('totalFee', totalFee);
    var note = 'Sell: Sold ' + count + ' ' + currency + ' for ' + amount + ' USD @ ' + cRate;

    if (Utility.getTotalBalance('USD') < amount) {
      throw new Meteor.Error("insufficient-funds", 'There is not enough USD for this transaction.')
      return {
        failMessage: 'There are not enough USD for this transaction.'
      }
    }

    return {
      debit: Utility.addTransaction('USD', amount, note),
      credit: Utility.addTransaction(currency, -count, note),
      fee: Utility.depositFee('USD', totalFee, note + ' and fee is '+ totalFee)
    }
  },
  depositViaKnox: function (currency, amount, txnid) {
    return Utility.addTransaction(currency, amount, 'ACH Deposit', txnid);
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
    // HTTP call to coinbase's api to get the rate of currency
    var apiUrl = 'https://api.coinbase.com/v1/currencies/exchange_rates'
    return HTTP.call("GET", apiUrl);
  },
  getCalculatedRate: function (currency) {
    var rate = Utility.getRate('USD', currency);
    return rate + (rate * 0.01); //added 10 precent fee
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
  },
  verifyBlockScoreUser: function(userData){
    var apiURL = 'https://api.blockscore.com/people';
    return HTTP.call("POST", apiURL, {data:userData, auth:blockScoreKey+":", headers:{'Accept': 'application/vnd.blockscore+json;version=4'}})   // return blockScore.people.create(userData)
  },
  saveUserInfo: function(userData, blockScoreData){
    return Utility.saveUserInfo(userData, blockScoreData);  
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
    return CustomerInfo.insert({"firstName": fname, "lastName": lname, "contactNo": cont});
  }
})
