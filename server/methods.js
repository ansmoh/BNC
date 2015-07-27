
Meteor.methods({

/**
 * [description]
 * @param  {[type]} symbol [description]
 * @param  {[type]} volume [description]
 * @return {[type]}        [description]
 */
  'orders/place/buy': function (symbol, volume) {
    //check(symbol, String);
    //check(volume, Number);
    var user = Meteor.users.findOne(this.userId);

    console.log('symbol', symbol);
    console.log('volume', volume);

    if (!this.userId) {
      throw new Meteor.Error(403, 'Access denied');
    }

    var rate = parseFloat(parseFloat(Utility.getRate('USD', symbol)).toFixed(5));
    console.log('rate', rate);

    var cRate = parseFloat(parseFloat(rate * (1 + Meteor.settings.fee)).toFixed(5));
    console.log('cRate', cRate);

    var amount = parseFloat(parseFloat(volume * cRate).toFixed(2));
    console.log('amount', amount);

    var totalFee = parseFloat(parseFloat(volume * rate * Meteor.settings.fee).toFixed(5));
    console.log('totalFee', totalFee);

    if (!amount || amount < 0.01) {
      throw new Meteor.Error(400, 'You cannot buy negative or 0 coins');
    }

    if (Utility.getTotalBalance('USD') < amount) {
      throw new Meteor.Error("insufficient-funds", 'There is not enough USD for this transaction.');
    }

    var note = 'Bought ' + volume + ' ' + symbol + ' @ ' + cRate;

    var result = {
      debit: Utility.addTransaction(symbol, parseFloat(volume), note),
      credit: Utility.addTransaction('USD', (-1) * amount, note),
      fee: Utility.depositFee('USD', totalFee, note + ' and fee is '+ totalFee)
    }

    Meteor.call('sendEmail', 'BuyAnyCoin: '+symbol+' Purchased', user.emails[0].address+',\n\n You have purchased '+volume+' '+symbol+'. \n\nThanks,\n BuyAnyCoin Team');

    return result;
  },

/**
 * [description]
 * @param  {[type]} symbol [description]
 * @param  {[type]} volume [description]
 * @return {[type]}        [description]
 */
  'orders/place/sell': function (symbol, volume) {
    var user = Meteor.users.findOne(this.userId);

    if (!user) {
      throw new Meteor.Error(403, 'Access denied');
    }

    var rate = parseFloat(parseFloat(Utility.getRate('USD', symbol)).toFixed(5));
    rate = rate * 0.98;// 2% down for selling
    console.log('rate', rate);
    var unitFee = rate * Meteor.settings.fee; //fee for transaction
    console.log('unitFee', unitFee);
    var cRate = parseFloat(parseFloat(parseFloat(rate) - parseFloat(unitFee)).toFixed(5));
    console.log('cRate', cRate);
    var amount = parseFloat(parseFloat(volume * cRate).toFixed(2));
    console.log('amount', amount);
    var totalFee = parseFloat(volume * unitFee);
    console.log('totalFee', totalFee);
    var note = 'Sell: Sold ' + volume + ' ' + symbol + ' for ' + amount + ' USD @ ' + cRate;

    if (!volume || volume <= 0) {
      throw new Meteor.Error(400, 'You cannot buy negative or 0 coins');
    }

    if (Utility.getAvailableBalance('USD') < amount) {
      throw new Meteor.Error(400, 'There is not enough USD for this transaction.');
    }

    var result = {
      debit: Utility.addTransaction('USD', amount, note),
      credit: Utility.addTransaction(symbol, (-1) * volume, note),
      fee: Utility.depositFee('USD', totalFee, note + ' and fee is '+ totalFee)
    }

    Meteor.call('sendEmail', 'BuyAnyCoin: '+symbol+' Sold', Meteor.user().emails[0].address+',\n\n You have sold '+volume+' '+symbol+'. \n\nThanks,\n BuyAnyCoin Team');

    return result;
  },

  'coins/withdraw': function (symbol, amount, address) {
    //check(symbol, String);
    //check(amount, Number);
    //check(address, String);
    var user = Meteor.users.findOne(this.userId),
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

    Utility.addTransaction(symbol, (-1) * parseFloat(amount), 'Withdraw -> ' + address);
    return Utility.addWithdrawRequest(symbol, parseFloat(amount), address);
  }

});