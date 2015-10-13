var cryptsy = Meteor.npmRequire('cryptsy-api');
CryptsyApi = new cryptsy(Meteor.settings.cryptsy.publicKey, Meteor.settings.cryptsy.secretKey);
var cryptsy2 = Meteor.npmRequire('cryptsyv2-api');
CryptsyApi2 = new cryptsy2(Meteor.settings.cryptsy.publicKey, Meteor.settings.cryptsy.secretKey);

Meteor.methods({

  'cryptsy/currencyMarkets': function (currency) {
    try {
      return Meteor.wrapAsync(function (currency, done) {
        CryptsyApi2.currencyMarkets({id:currency}, function (err, result) {
          if (err) {
            console.log(err);
            done(err);
          } else {
            done(null, result.data);
          }
        });
      })(currency);
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  },

/**
 * [description]
 * @param  {[type]} marketId [description]
 * @return {[type]}          [description]
 */
  'cryptsy/ticker': function (marketId) {
    try {
      return Meteor.wrapAsync(function (marketId, done) {
        CryptsyApi2.ticker({id:marketId}, function (err, result) {
          if (err) {
            console.log(err);
            done(err);
          } else {
            done(null, result.data);
          }
        });
      })(marketId);
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  },

/**
 * [description]
 * @param  {[type]} marketid  [description]
 * @param  {[type]} ordertype [description]
 * @param  {[type]} quantity  [description]
 * @param  {[type]} price     [description]
 * @return {[type]}           [description]
 */
  'cryptsy/createorder': function (marketid, ordertype, quantity, price) {
    var user = Meteor.users.findOne(this.userId);

    if (!user) {
      throw new Meteor.Error(403, "Access denied");
    }

    console.log(marketid, ordertype, quantity, price);

    try {
      return Meteor.wrapAsync(function (marketid, ordertype, quantity, price, done) {
        CryptsyApi.createorder(marketid, ordertype, quantity, price, function (err, result) {
          if (err) {
            //console.log(err);
            done(err);
          } else {
            done(null, result);
          }
        });
      })(marketid, ordertype, quantity, price);
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  },

/**
 * [description]
 * @param  {[type]} address [description]
 * @param  {[type]} amount  [description]
 * @return {[type]}         [description]
 */
  'cryptsy/makewithdrawal': function (address, amount) {
    var user = Meteor.users.findOne(this.userId);

    if (!user) {
      throw new Meteor.Error(403, "Access denied");
    }

    try {
      return Meteor.wrapAsync(function (address, amount, done) {
        CryptsyApi.makewithdrawal(address, amount, function (err, result) {
          if (err) {
            console.log(err);
            done(err);
          } else {
            done(null, result);
          }
        });
      })(address, amount);
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  },

});
