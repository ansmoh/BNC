
Meteor.methods({

  'orders/create': function (type, primaryCode, secondaryCode, amount, rate) {
    var user = Meteor.users.findOne(this.userId),
        currency = Currencies.findOne({code:primaryCode}),
        amount = parseFloat(amount),
        res;

    if (!user || !currency || !currency.marketid) {
      throw new Meteor.Error(403, 'Access denied');
    }

    if (secondaryCode === 'USD') {
      rate = currency.rate;
    } else {
      rate = currency.btcRate;
    }

    if (!amount || amount <= 0) {
      throw new Meteor.Error(400, 'You cannot buy negative or 0 coins');
    }

    if (type === 'buy') {
      price = rate * (1 + currency.buyFee());
    } else {
      price = rate * (1 - currency.sellFee());
    }

    //console.log(currency);
    //console.log(price); // Price
    //console.log(amount * rate) // Sub Total
    //console.log(amount * rate * 0.01) // Fee
    //console.log(amount * rate * 1.01) // Net Total
    //console.log(Utility.getTotalBalance(secondaryCode));
    //throw new Meteor.Error(400, 'You cannot buy negative or 0 coins');

    if (Utility.getTotalBalance(secondaryCode) < amount * price) {
      throw new Meteor.Error(400, 'There is not enough '+secondaryCode+' for this transaction.');
    }

    if (type === 'buy') {
      if (res = Meteor.call('cryptsy/createorder', currency.marketid, 'buy', amount, price)) {
        var note = 'Bought ' + parseFloat(amount).toFixed(8) + ' ' + primaryCode + ' @ ' + parseFloat(price).toFixed(8) + ' ' + secondaryCode;
        // Debit
        Transactions.insert({
          orderId: res.orderid,
          user: this.userId,
          currency: primaryCode,
          amount: amount,
          note: note,
          status: 'complete',
          timestamp: new Date()
        })
        // Credit
        Transactions.insert({
          orderId: res.orderid,
          user: this.userId,
          currency: secondaryCode,
          amount: (-1) * amount * price,
          note: note,
          status: 'complete',
          timestamp: new Date()
        })
        // Fee
        Utility.depositFee(secondaryCode, (-1) * amount * rate * currency.buyFee(), note + ' and fee is '+ parseFloat(amount * rate * currency.buyFee()).toFixed(8));
        return Meteor.call('sendEmail', 'BuyAnyCoin: '+primaryCode+' Purchased', user.emails[0].address+',\n\n You have purchased '+amount+' '+primaryCode+'. \n\nThanks,\n BuyAnyCoin Team');
      }
    } else if (type === 'sell') {
      if (res = Meteor.call('cryptsy/createorder', currency.marketid, 'sell', amount, price)) {
        var note = 'Sold ' + parseFloat(amount).toFixed(8) + ' ' + primaryCode + ' @ ' + parseFloat(price).toFixed(8) + ' ' + secondaryCode;
        // Debit
        Transactions.insert({
          orderId: res.orderid,
          user: this.userId,
          currency: secondaryCode,
          amount: amount * price,
          note: note,
          status: 'complete',
          timestamp: new Date()
        })
        // Credit
        Transactions.insert({
          orderId: res.orderid,
          user: this.userId,
          currency: primaryCode,
          amount: (-1) * amount,
          note: note,
          status: 'complete',
          timestamp: new Date()
        })
        // Fee
        Utility.depositFee(primaryCode, (-1) * amount * currency.buyFee(), note + ' and fee is '+ parseFloat(amount * currency.buyFee()).toFixed(8));
        return Meteor.call('sendEmail', 'BuyAnyCoin: '+primaryCode+' Sold', user.emails[0].address+',\n\n You have sold '+amount+' '+primaryCode+'. \n\nThanks,\n BuyAnyCoin Team');
      }
    } else {
      throw new Meteor.Error(400, 'Order type invalid');
    }
  },

/**
 * [description]
 * @param  {[type]} symbol [description]
 * @param  {[type]} volume [description]
 * @return {[type]}        [description]
 */
  'orders/place/buy': function (symbol, volume) {
    //check(symbol, String);
    //check(volume, Number);
    var user = Meteor.users.findOne(this.userId),
        currency = Currencies.findOne({code:symbol}),
        res;

    console.log('symbol', symbol);
    console.log('volume', volume);

    if (!user || !currency || !currency.marketid) {
      throw new Meteor.Error(403, 'Access denied');
    }

    var rate = parseFloat(parseFloat(Utility.getRate('USD', symbol)).toFixed(5));
    console.log('rate', rate);

    var cRate = parseFloat(parseFloat(rate * (1 + Meteor.settings.fee)).toFixed(5));
    console.log('cRate', cRate);

    //var amount = parseFloat(parseFloat(volume * cRate).toFixed(2));
    var amount = volume * cRate;
    console.log('amount', amount);

    var totalFee = parseFloat(parseFloat(volume * rate * Meteor.settings.fee).toFixed(5));
    console.log('totalFee', totalFee);

    if (!amount || amount <= 0) {
      throw new Meteor.Error(400, 'You cannot buy negative or 0 coins');
    }

    if (Utility.getTotalBalance('USD') < amount) {
      throw new Meteor.Error("insufficient-funds", 'There is not enough USD for this transaction.');
    }

    if (res = Meteor.call('cryptsy/createorder', currency.marketid, 'Buy', volume, currency.rate)) {
      console.log(res);
      var note = 'Bought ' + volume + ' ' + symbol + ' @ ' + cRate;
      var result = {
        debit: Utility.addTransaction(symbol, parseFloat(volume), note),
        credit: Utility.addTransaction('USD', (-1) * amount, note),
        fee: Utility.depositFee('USD', totalFee, note + ' and fee is '+ totalFee)
      }
      Meteor.call('sendEmail', 'BuyAnyCoin: '+symbol+' Purchased', user.emails[0].address+',\n\n You have purchased '+volume+' '+symbol+'. \n\nThanks,\n BuyAnyCoin Team');
      return result;
    }

    throw new Meteor.Error(500, 'Faild call api');
  },

/**
 * [description]
 * @param  {[type]} symbol [description]
 * @param  {[type]} volume [description]
 * @return {[type]}        [description]
 */
  'orders/place/sell': function (primaryCode, volume) {
    var user = Meteor.users.findOne(this.userId),
        currency = Currencies.findOne({code:primaryCode}),
        secondaryCode = 'BTC',
        amount = volume,
        price,
        res;

    if (!user || !currency || !currency.marketid) {
      throw new Meteor.Error(403, 'Access denied');
    }

    if (primaryCode === 'BTC') {
      price = currency.rate;
      secondaryCode = 'USD';
    } else {
      price = currency.btcRate;
      secondaryCode = 'BTC';
    }

    //console.log(currency);
    //console.log(price); // Price
    //console.log(amount * price) // Sub Total
    //console.log(amount * price * 0.03) // Fee
    //console.log(amount * price * 0.97) // Net Total
    //console.log(Utility.getTotalBalance(primaryCode));
    //
    //throw new Meteor.Error(403, 'Access denied');

    if (!amount || amount <= 0) {
      throw new Meteor.Error(400, 'You cannot buy negative or 0 coins');
    }

    if (Utility.getTotalBalance(primaryCode) < amount) {
      throw new Meteor.Error(400, 'There is not enough '+primaryCode+' for this transaction.');
    }

    if (res = Meteor.call('cryptsy/createorder', currency.marketid, 'sell', amount, price * 0.97)) {

      var note = 'Sold ' + parseFloat(amount).toFixed(8) + ' ' + primaryCode + ' @ ' + parseFloat(price * 0.97).toFixed(8) + ' ' + secondaryCode;
      // Debit
      Transactions.insert({
        orderId: res.orderid,
        user: this.userId,
        currency: secondaryCode,
        amount: amount * price * 0.97,
        note: note,
        status: 'complete',
        timestamp: new Date()
      })
      // Credit
      Transactions.insert({
        orderId: res.orderid,
        user: this.userId,
        currency: primaryCode,
        amount: (-1) * amount,
        note: note,
        status: 'complete',
        timestamp: new Date()
      })
      // Fee
      Utility.depositFee(primaryCode, amount * currency.rate * 0.03, note + ' and fee is '+ parseFloat(amount * currency.rate * 0.03).toFixed(8));
      /*
      var result = {
        debit: Utility.addTransaction('USD', amount, note),
        credit: Utility.addTransaction(symbol, (-1) * volume, note),
        fee: Utility.depositFee('USD', totalFee, note + ' and fee is '+ totalFee)
      }*/
      return Meteor.call('sendEmail', 'BuyAnyCoin: '+primaryCode+' Sold', Meteor.user().emails[0].address+',\n\n You have sold '+amount+' '+primaryCode+'. \n\nThanks,\n BuyAnyCoin Team');
      //return result;
    }
  },

  'coins/withdraw': function (symbol, amount, address) {
    //check(symbol, String);
    //check(amount, Number);
    //check(address, String);
    var user = Meteor.users.findOne(this.userId),
        currency = Currencies.findOne({code:symbol}),
        address = s.trim(address);

    if (!user) {
      throw new Meteor.Error(403, 'Access denied');
    }

    if (!address || address.length < 4) {
      throw new Meteor.Error(400, "Destination address is required and should be min 4 characters.");
    }

    console.log(Utility.getTotalBalance(symbol));

    if (!amount || amount <= 0 || Utility.getTotalBalance(symbol) < amount) {
      throw new Meteor.Error(400, "Please check the withdraw amount.");
    }

    var result = HTTP.get("https://shapeshift.io/validateAddress/"+address+"/"+symbol);
    if (!result.data.isvalid || result.data.error) {
      throw new Meteor.Error(400, 'Invalid withdraw address, please check the address and try again');
    }

    if (res = Meteor.call('cryptsy/makewithdrawal', address, amount)) {
      Utility.addTransaction(symbol, (-1) * parseFloat(amount), 'Withdraw -> ' + address);
      return Utility.addWithdrawRequest(symbol, parseFloat(amount), address);
    }

  }

});