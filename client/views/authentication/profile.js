Template.Profile.helpers({
  customerInfo:function () {
    return CustomerInfo.find({userId: Meteor.userId()}).fetch();
  }
});

Template.CustomerInfoForm.rendered = function() {
    VMasker(this.find("[maskphone]")).maskPattern("999-999-9999");
};

Template.CustomerDetails.helpers({
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
  showVerifyButton: function () {
    if (this.status == 'complete') {
      return false
    };
    return true
  },
  showVerificationArea: function () {
    return Session.equals('showVerificationArea', true)
  }
});

Template.CustomerDetails.events({
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
  }
});
