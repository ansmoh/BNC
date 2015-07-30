
Template.Login.events({
  'submit form' : function(event, t){
    //var email = t.find('#signin-email').value,
        //password = t.find('#signin-password').value;
    var data = form2js(event.target, null, false),
        email = s.trim(data.email),
        password = data.password;

    event.stopImmediatePropagation();
    event.preventDefault();

    // If validation passes, supply the appropriate fields to the
    // Meteor.loginWithPassword() function.
    if (email && password) {
      Meteor.loginWithPassword(email, password, function (err) {
        if (err) {
          // The user might not have been found, or their passwword
          // could be incorrect. Inform the user that their
          // login attempt has failed.
          if (err.reason.indexOf('forbidden') !== -1) {
            toastr.error("Your account is temporarily disabled. Please wait or reset your password.", 'Login error: Account Locked');
          } else {
            toastr.error(err.reason, 'Login error');
          }
        } else {
          // The user has been logged in.
          console.log('logged in')
          toastr.success('You have logged-in successfully.', 'Login');
        }
      });
    }
  }
});
