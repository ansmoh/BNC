Template.SignUp.events({
  'submit #register-form' : function(event, t) {
    var data = form2js(event.target, null, false),
        email = s.trim(data.email),
        password = s.trim(data.password),
        term = data.term;

    event.preventDefault();

    var isValidEmail = function (email) {
      if (email && SimpleSchema.RegEx.Email.test(email)) {
        return true;
      } else {
        toastr.error("Email address is invalid", 'Sign Up error');
        return false;
      }
    }

    var isValidPassword = function(val) {
      if (val.length >= 6) {
        return true;
      } else {
        toastr.error("Password must be at least 6 characters", 'Password Error');
        return false;
      }
    }

    var isValidTerm = function (val) {
      if (val && val === true) {
        return true;
      } else {
        toastr.error("Please agree to the Terms and Condition and Privacy Policy", 'Sign Up error');
        return false;
      }
    }

    if (isValidEmail(email) && isValidPassword(password) && isValidTerm(term)){
      Accounts.createUser({email: email, password : password}, function (err) {
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
          Router.go('/not-verified');
        }
      });
    }
  }
});