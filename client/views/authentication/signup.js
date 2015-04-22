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
        toastr.error("Password must be at least 6 characters", 'Password Error');
        return false; 
      }
    }

    if (isValidPassword(password)){
      Accounts.createUser({email: email, password : password}, function(err){
        if (err) {
          // Inform the user that account creation failed
          // alert(err);
          toastr.error(err.reason, 'Sign Up error');
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
          toastr.success('You have signed up successfully. Please check your email to confirm the address.', 'Sign Up');
        }
      });
    }
    return false;
  }
});