
Meteor.publish('customerInfo', function() {
  return User.find({userId: this.userId});
});

Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('transactions', function() {
  return Transactions.find({user: this.userId});
});

Meteor.publish('withdrawRequest', function() {
  return WithdrawalRequest.find({user: this.userId});
});

Meteor.publish('voucher', function() {
  return Voucher.find();
});

Meteor.publish('accountStatus', function() {
  return User.find({userId: this.userId});
});

Meteor.publish('settingsInfo', function () {
	return Settings.find({});
});