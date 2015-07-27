var cryptsy = Meteor.npmRequire('cryptsy-api');
Cryptsy = new cryptsy(Meteor.settings.cryptsy.publicKey, Meteor.settings.cryptsy.secretKey);
