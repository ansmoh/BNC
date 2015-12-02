Template.Account.helpers({
  customerInfo:function () {
    if (Meteor.user() && (user = User.findOne({userId: Meteor.userId()}))) {
      return user;
    }
  },
  emailAddress:function () {
    if (Meteor.user()) {
      return Meteor.user().emails[0].address;
    }
  },
  tier1Class: function () {
    if (this.status == 'complete' && this.nickName != "" && Meteor.user().emails[0].verified) {
      return "success"
    };
    return 'danger'
  },
  tier2Class: function () {
    if (this.synapsepay && this.synapsepay.status && this.synapsepay.status == 'valid') {
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
  isUpdateNotifChecked: function () {
    if (Meteor.user() && (user = User.findOne({userId: Meteor.userId()}))) {
      return user.notifUpdate?true:false;
    }
  },
  isPromotionNotifChecked: function (){
    if (Meteor.user() && (user = User.findOne({userId: Meteor.userId()}))) {
      return user.notifPromotion?true:false;
    }
  },
  profileCompleted: function () {
    var percent = 0;
    if (Meteor.user() && (user = User.findOne({userId: Meteor.userId()}))) {
      var deposit = totalDepositFn(),
          diffDays = moment().diff(Session.get('lastTimeStamp') || new Date,'days');

      if (user && _.has(user, 'synapsepay') && deposit >= 5000 && diffDays > 0) {
        precent = 100;
      } else if (user && _.has(user, 'synapsepay')) {
        percent = 80;
      } else if (user) {
        percent = 30;
      }
    }
    return percent;
    /*
    var res = User.findOne({userId: Meteor.userId()});
    // var res = user_info.customerInfo;
    var deposit = totalDepositFn();
    var dt = Session.get('lastTimeStamp') || new Date();
    var timeDiff = Math.abs(new Date().getTime() - dt.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if( res && _.has(res, "synapsepay")&& deposit >= 5000 && diffDays > 30){
      return 100;
    }
    else if( res && _.has(res, "synapsepay")){
      return 80;
    }
    else if(res){
      return 30;
    }
    else{
      return 0;
    }*/
  }
});

Template.Account.events({
  'click #notifUpdate': function (event, tmpl) {
    var state = $(event.target).is(':checked'),
        user = User.findOne({userId:Meteor.userId()}),
        customerInfo = CustomerInfo.findOne({userId: Meteor.userId()});

    user && User.update(user._id, {$set: {notifUpdate: state}});
    customerInfo && CustomerInfo.update(customerInfo._id, {$set: {notifPromotion: state}});
  },
  'click #notifPromotion': function (event, tmpl) {
    var state = $(event.target).is(':checked'),
        user = User.findOne({userId: Meteor.userId()}),
        customerInfo = CustomerInfo.findOne({userId: Meteor.userId()});

    user && User.update(user._id, {$set: {notifPromotion: state}});
    customerInfo && CustomerInfo.update(customerInfo._id, {$set: {notifPromotion: state}});
  }
})
