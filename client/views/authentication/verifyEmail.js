Template.VerifyEmail.rendered = function () {
  var token = Session.get('verifyEmail');
  if(token){
    Accounts.verifyEmail(token, function (error) {
      if (error) {
        Session.set('verifyEmailStatus', "error");
      }
      else{
        Session.set('verifyEmailStatus', "success");
        Session.set('verifyEmail', null);
      };
    })
  }
  else{
    Session.set('verifyEmailStatus', "error");
  }
}

Template.VerifyEmail.helpers({
  verifyEmailStatus: function () {
    if (Session.equals('verifyEmailStatus', 'error')) {
      return "Sorry, your email is not verified."
    }
    else{
      return "Your email is verified successfully."
    };
  }
});