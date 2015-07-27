var cryptsy = Meteor.npmRequire('cryptsy-api');
CryptsyApi = new cryptsy(Meteor.settings.cryptsy.publicKey, Meteor.settings.cryptsy.secretKey);

Meteor.methods({
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
