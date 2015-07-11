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
  },
  isUpdateNotifChecked: function (){
    Session.set('cID', this._id);
    return (this.notifUpdate)? 'checked': '';
  },
  isPromotionNotifChecked: function (){
    return (this.notifPromotion)? 'checked': '';
  },
  profileCompleted:function(){
    var res = CustomerInfo.findOne({userId: Meteor.userId()});
    var deposit = totalDepositFn();
    var dt = Session.get('lastTimeStamp') || new Date();
    var timeDiff = Math.abs(new Date().getTime() - dt.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    if( res && _.has(res, "blockscore")&& deposit >= 5000 & diffDays > 30){
      return 100;
    }
    else if( res && _.has(res, "blockscore")){
      return 80;
    }
    else if(res){
      return 30;
    }
    else{
      return 0;
    }
  }
});

Template.Account.events({
  'change #notifUpdate': function (e, t){
    // CustomerInfo.update({_id: Session.get('cID')}, {$set: {notifUpdate: t.find('#notifUpdate').checked}});
    $(e.currentTarget).prop('checked', true);
  },
  'change #notifPromotion': function (e, t){
    // CustomerInfo.update({_id: Session.get('cID')}, {$set: {notifPromotion: t.find('#notifPromotion').checked}});
    $(e.currentTarget).prop('checked', true);
  }
})