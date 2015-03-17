Template.Account.helpers({
  customerInfo:function () {
    return CustomerInfo.find({userId: Meteor.userId()}).fetch();
  },
  emailAddress:function () {
    return Meteor.user().emails[0].address;
  },
  tier1Class: function () {
    if (this.status == 'complete' && this.nickName != "" && Meteor.user().emails[0].verified) {
      return "success"
    };
    return 'danger'
  },
  tier2Class: function () {
    if (this.blockscore && this.blockscore.status && this.blockscore.status == 'valid') {
      return "success"
    };
    return 'danger'
  },
  tier3Class: function () {
  	var totalDeposit = 0;
  	var lastTimeStamp = 0;
  	Transactions.find({user: Meteor.userId(), currency: "USD", status: 'complete'}).map(function(transaction) {
      if (parseFloat(transaction.amount) > 0) {
        totalDeposit += parseFloat(transaction.amount);
        if (lastTimeStamp == 0 || lastTimeStamp > transaction.timestamp) {
          lastTimeStamp = transaction.timestamp;
        };
      };
    });

    if (totalDeposit >= 5000 && (lastTimeStamp.getTime() < new Date().setDate((new Date().getDate())-30))) {
      return "success";
    };
    return "danger";
  }
});
