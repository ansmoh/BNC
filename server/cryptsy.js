var cryptsy = Meteor.npmRequire('cryptsy-api');
CryptsyApi = new cryptsy(Meteor.settings.cryptsy.publicKey, Meteor.settings.cryptsy.secretKey);

Meteor.methods({
  'cryptsy/createorder': function (marketid, ordertype, quantity, price) {
    var user = Meteor.users.findOne(this.userId);

    if (!user) {
      throw new Meteor.Error(403, "Access denied");
    }

    try {
      return Meteor.wrapAsync(function (marketid, ordertype, quantity, price, done) {
        CryptsyApi.createorder(marketid, ordertype, quantity, price, function (err, result) {
          if (err) return done(err);
          done(null, result);
        });
      })(marketid, ordertype, quantity, price);
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  }
});
