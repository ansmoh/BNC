var trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

var isNotEmpty = function(val) {
  return (val == "" || val == null)? false : true;
}

var isValidPassword = function(val) {
  if (val.length >= 6) {
    return true;
  } else {
    toastr.error("Password is too short", 'Password error');
    return false; 
  }
}
var isEmail = function(email) {
  var p = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return p.test(email);
}

Template.ForgotPassword.helpers({
  resetPassword : function(t) {
    return Session.get('resetPassword');
  }
});

Template.ForgotPassword.events({
  'submit #recovery-form' : function(e, t) {
    e.preventDefault()

    var email = trimInput(t.find('#recovery-email').value)

    if (isNotEmpty(email) && isEmail(email)) {
      Session.set('loading', true);
      Accounts.forgotPassword({email: email}, function(err){
        if (err)
          toastr.error(err.reason, 'Password Reset Error');
        else {
          toastr.success('Please check your email for your password reset link', 'Password Reset');
        }
        Session.set('loading', false);
      });
    }
    return false; 
  },
  'submit #reset-password' : function(e, t) {
    e.preventDefault();
    var pw = t.find('#new-password').value;
    if (isNotEmpty(pw) && isValidPassword(pw)) {
      Session.set('loading', true);
      Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
        if (err)
          toastr.error(err.reason, 'Password Reset Error');
        else {
          Session.set('resetPassword', null);
          toastr.success("Password changed successfully", 'Password Reset');
        }
        Session.set('loading', false);
      });
    }
    return false; 
  }
});