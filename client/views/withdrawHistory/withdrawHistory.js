Template.WithdrawHistory.helpers({
  pendingWithdraw: function () {
    return WithdrawalRequest.find({user: Meteor.userId(), status: 'pending'}).fetch();
  },
  completedWithdraw: function () {
    return WithdrawalRequest.find({user: Meteor.userId(), status: 'complete'}).fetch();
  }
});

Template.WithdrawLog.helpers({
  dateTime: function () {
    return new Date(this.timestamp).toGMTString();
  },
});

