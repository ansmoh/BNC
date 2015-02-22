Meteor.publish('currencies', function() {
  return Currencies.find();
});

Meteor.publish('customerInfo', function() {
  return CustomerInfo.find({userId: this.userId});
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
