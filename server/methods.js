
Meteor.methods({

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

});