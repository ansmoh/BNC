Template.Profile.rendered = function() {
    VMasker(this.find("[maskphone]")).maskPattern("999-999-9999");
};

Template.Profile.helpers({
  customerInfo:function () {
    return CustomerInfo.find({userId: Meteor.userId()}).fetch();
  },
  showCustomerInfoForm:function () {
    var customerData = CustomerInfo.find({userId: Meteor.userId(), "blockscore.object": "person"}).fetch();
    return customerData.length ? false: true;
  },
  getImage:function (id) {
    return Images.find({_id:id})
  },
  status: function () {
    if (this.status == 'complete') {
      return "Authorized"
    };
    return this.status
  },
  statusClass: function () {
    if (this.status == 'complete') {
      return "success"
    };
    return 'warning'
  },
  contactPanelClass: function () {
    if (this.status == 'complete') {
      return "success"
    };
    return 'danger'
  },
  showVerifyButton: function () {
    if (this.status == 'complete') {
      return false
    };
    return true
  },
  bsPanelClass: function () {
    if (this.blockscore && this.blockscore.status && this.blockscore.status == 'valid') {
      return "success"
    };
    return 'danger'
  },
  showVerificationArea: function () {
    return Session.equals('showVerificationArea', true)
  },
  totalDeposit: function () {
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

    Session.set('depositVerified', false);
    Session.set('lastTimeStamp', lastTimeStamp);
    if (totalDeposit >= 5000) {
      Session.set('depositVerified', true);
    };
    return totalDeposit;
  },
  depositTimestamp: function () {
    var dt = Session.get('lastTimeStamp') || new Date();
    var timeDiff = Math.abs(new Date().getTime() - dt.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return  diffDays + ' days ago ('+ dt.toDateString()+')';
  },
  depositPanelClass: function () {
    console.log('lastTimeStamp', Session.get('lastTimeStamp'), new Date().setDate((new Date().getDate())-30));
    if (Session.get('depositVerified') && (Session.get('lastTimeStamp').getTime() < new Date().setDate((new Date().getDate())-30))) {
      return "success";
    };
    return "danger";
  }
});

Template.Profile.events({
  'click .verify':function (e, t) {
    t.find('.verify').innerHTML = 'Resend token';
    Meteor.call('verifyNumber', this.contactNo.replace('-', ''), function (error, result) {
      if (error) {
        console.log(error)
        toastr.error(error, 'Phone Verification')
      } else {
        console.log(result)
        if(!result.data.success)
          toastr.error(result.data.message, 'Phone Verification')
        else{
          Session.set('showVerificationArea', true);
          toastr.success(result.data.message, 'Phone Verification')
        }
      }
    })
  },
  'click .verifyToken':function (e, t) {
    var token = t.find('#token').value;
    if (token.length < 4) {
      alert('Please enter a valid token.')
      return;
    };
    Meteor.call('verifyToken', this.contactNo.replace('-', ''), token, function (error, result) {
      if (error) {
        console.log(error)
        alert(error)
      } else {
        console.log(result)
        if(!result.data.success)
          toastr.error(result.data.message, 'Phone Verification')
        else{
          Session.set('showVerificationArea', null);
          toastr.success(result.data.message, 'Phone Verification')
          Meteor.call('authrizeNumber', function (err, res) {
            console.log(err, res);
          })
        }
      }
    })
  },
  'click .tokenSent' : function (e, t) {
    t.find('.verify').innerHTML = 'Resend token';
    Session.set('showVerificationArea', true);
  },
});

Template.BlockscoreModal.helpers({
  yearValues: function(){
    var values = [];
    for(var year=1950; year<=new Date().getFullYear(); year++)
    {
      values.push({name:year, value:year}); 
    }
    return values;
  },  
  monthValues: function(){
    var values = [];
    var names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    for(var month=1; month<=12; month++)
    {
      values.push({name:names[month], value:month}); 
    }
    return values;
  },  
  dayValues: function(){
    var values = [];
    for(var day=1; day<=31; day++)
    {
      values.push({name:day, value:day}); 
    }
    return values;
  },
})

Template.BlockscoreModal.events({
  'click .blockscore-verify' : function(e, t){
    userData={};
    $.each($('#blockscore-verify-form').serializeArray(), function() {
        userData[this.name] = this.value;
    });
    console.log(userData);
    Meteor.call('verifyBlockScoreUser', userData, function (err, res) {
      // console.log(err, res);
      if (err) {
        toastr.error(err, 'Verification Error');
        return console.log(err);
      };
      Meteor.call('saveUserInfo', userData, res.data, function(error, resp){
        if (error) {
          toastr.error(error, 'Verification Error');
          return console.log(error);
        };
        console.log('resp', resp);
        toastr.success('Verification successful.', 'Verification');
        $('#tier2').removeClass('in');
      })
    })
  }
})
