Template.SignUp.events({
  'submit #register-form' : function(e, t) {
    e.preventDefault();
    var email = t.find('#account-email').value
      , password = t.find('#account-password').value;

    // Trim and validate the input
    var trimInput = function(val) {
      return val.replace(/^\s*|\s*$/g, "");
    }

    email = trimInput(email);

    var isValidPassword = function(val) {
      if (val.length >= 6) {
        return true;
      } else {
        toastr.error("Too short password.", 'Password error');
        return false; 
      }
    }

    if (isValidPassword(password)){
      Accounts.createUser({email: email, password : password}, function(err){
        if (err) {
          // Inform the user that account creation failed
          // alert(err);
          toastr.error(err.reason, 'SignUp error');
        } else {
          // Success. Account has been created and the user
          // has logged in successfully. 
          console.log('logged in');
          Meteor.call('sendVerificationEmail', function (error, result) {
            if (error) {
              console.log(error)
              alert(error)
            } else {
              console.log(result)
            }
          })
          toastr.success('You have signed-up successfully. We sent a confirmation email to you and to verify your email address. Please check your emails and confirm your email address.', 'SignUp');
        }
      });
    }
    return false;
  }
});