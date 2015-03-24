Template.Login.events({
  'submit #signin-form' : function(e, t){
    e.preventDefault();
    var email = t.find('#signin-email').value
      , password = t.find('#signin-password').value;

    // Trim and validate your fields here....
    var trimInput = function(val) {
      return val.replace(/^\s*|\s*$/g, "");
    }

    email = trimInput(email);

    // If validation passes, supply the appropriate fields to the
    // Meteor.loginWithPassword() function.
    Meteor.loginWithPassword(email, password, function(err){
      if (err){
        // The user might not have been found, or their passwword
        // could be incorrect. Inform the user that their
        // login attempt has failed.      
        if (err.reason.indexOf('forbidden') > -1) {
          toastr.error("Your account is not active. Please contact admin to activate your account.", 'Login error: Account blocked');
        }
        else{
          toastr.error(err.reason, 'Login error');
        };  
      } else {
        // The user has been logged in.
        console.log('logged in')
        toastr.success('You have logged-in successfully.', 'Login');
      }
    });
    return false;
  }
});
