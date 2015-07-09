Template.Profile.rendered = function() {
    $('[data-toggle="tooltip"]').tooltip()
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
    if (this.status == 'pending' && this.contactNo) {
      var infoId = this._id;
      Meteor.call('verifyNumber', this.contactNo.replace('-', ''), function (error, result) {
        if (error) {
          console.log(error)
          toastr.error(error.reason, 'Phone Verification')
        } else {
          console.log(result)
          if(!result.data.success)
            toastr.error(result.data.message, 'Phone Verification')
          else{
            Session.set('showVerificationArea', true);
            $('#tier1').addClass('in')
            CustomerInfo.update({_id: infoId}, {$set: {status: 'processing'}})
            toastr.success(result.data.message, 'Phone Verification')
          }
        }
      })
      
    };
    return this.status
  },
  statusClass: function () {
    if (this.status == 'complete' && this.nickName != "" && Meteor.user().emails[0].verified) {
      return "success"
    }
    else if(this.status == 'processing'){
      return 'info'
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
    console.log(this);
    if (this.blockscore && this.blockscore.status && this.blockscore.status == 'valid') {
      return "success"
    };
    return 'danger'
  },
  showVerificationArea: function () {
    if (this.status== 'complete') {
      Session.set('showVerificationArea', null);
    };
    return Session.equals('showVerificationArea', true)
  },
  totalDeposit: function () {
    return totalDepositFn();
  },
  depositTimestamp: function () {
    var dt = Session.get('lastTimeStamp') || new Date();
    var timeDiff = Math.abs(new Date().getTime() - dt.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return  diffDays + ' days ago ('+ dt.toDateString()+')';
  },
  depositPanelClass: function () {
    $('[data-toggle="tooltip"]').tooltip() //just hack: initiating again if not added anywhere on render
    console.log('lastTimeStamp', Session.get('lastTimeStamp'), new Date().setDate((new Date().getDate())-30));
    if (Session.get('depositVerified') && (Session.get('lastTimeStamp').getTime() < new Date().setDate((new Date().getDate())-30))) {
      return "success";
    };
    return "danger";
  }
});

Template.Profile.events({
  'click .verify':function (e, t) {
    console.log("in verify area")
    //t.find('.verify').innerHTML = 'Resend token';
    Meteor.call('verifyNumber', this.contactNo.replace('-', ''), function (error, result) {
      console.log("verifyNumber res ", error, result)
      if (error) {
        console.log(error)
        toastr.error(error.reason, 'Phone Verification')
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
          var content = 'Hello '+Meteor.user().emails[0].address+',\n\n Your Tier 1 details have been verified succesfully. \n\nGood Job!'
          Meteor.call('sendEmail', 'BuyAnyCoin: Tier 1 Verified', content, function(err, res){
            if (err) {
              console.log(err)
              toastr.error(err.reason, 'Mail not sent')
            } else {
              console.log("Mail sent successfully")
            }
          })
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
  'click #submitTier':function(e, t){
    e.preventDefault();
    var firstname = $("#firstName").val();
    var lastname = $("#lastName").val();
    var contact = $("#contactNo").val();
    Meteor.call('getNamesStatus',firstname,lastname,function(e,r){
      if(e){
        toastr.error(e.reason);
      }
      else{
        if(r.statusCode === 200){
          if( r.content !== undefined && r.content === "[]"){
            Meteor.call('addCustomerInfo', firstname, lastname, contact, function(err,res){
              if(err){
                toastr.error(err.reason);
              }
              else{
                toastr.success('User details updated');
              }
            })
          }
          else{
            toastr.error("Contact Support")
          }
        }
      }
    });
  }
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
    $(".tier2CusColor").css('background-color', "orange");
    userData={};
    $.each($('#blockscore-verify-form').serializeArray(), function() {
        userData[this.name] = this.value;
    });
    console.log(userData);
    Meteor.call('verifyBlockScoreUser', userData, function (err, res) {
      if (err) {
        toastr.error(err.reason, 'Please check the form to ensure it is complete and try again.', 'Submission Error');
        return console.log(err);
      };
      console.log(res);
      Meteor.call('saveUserInfo', userData, res.data, function(error, resp){
        if (error) {
          // toastr.error(error.reason, 'Verification Error');
          toastr.error("Please check the form for the correct information and try again.", 'Submission Error');
          return console.log(error);
        };
        // console.log('resp', resp, res.data);
        $(".tier2CusColor").css('background-color', "");
        toastr.success('Verification successful.', 'Verification');
        $('#tier2').removeClass('in');
        $('#blockscore-form').modal('hide')
        if (res.data.status && res.data.status == 'valid') {
          var content = 'Hello '+Meteor.user().emails[0].address+',\n\n Your Tier 2 details have been verified succesfully. \n\n Even Better!'
          Meteor.call('sendEmail', 'BuyAnyCoin: Tier 2 Verified', content, function(err, res){
            if (err) {
              console.log(err)
              toastr.error(err.reason, 'Mail not sent')
            } else {
              console.log('Mail send successfully')
            }
          })
        }

      })
    })
  },
  'propertychange .numbers, change .numbers, click .numbers, keydown .numbers, input .numbers, paste .numbers': function (e, t) {
    // Allow: backspace, delete, tab, escape, enter and no need of . so not allowing 110, 190
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
       // Allow: Ctrl+A
       (e.keyCode == 65 && e.ctrlKey === true) || 
       // Allow: home, end, left, right, down, up
       (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  },
  'propertychange .chars, change .chars, click .chars, keydown .chars, input .chars, paste .chars': function (e, t) {
    // Allow: backspace, delete, tab, escape, enter
    if ($.inArray(e.keyCode, [8, 46, 9, 27, 13]) !== -1 ||
       // Allow: home, end, left, right, down, up
       (e.keyCode >= 35 && e.keyCode <= 40) ||
       // Allow: a-z and A-Z
       (e.keyCode >= 65 && e.keyCode <= 90)) {
        // let it happen, don't do anything
        return;
    }
    e.preventDefault();
  }
})
