
Router.onBeforeAction(function () {
  if (!Meteor.userId()) {
    // if the user is not logged in, render the Login template
    this.layout('blankLayout');
    this.render('Login');
  } else {
    if (Meteor.user() && Meteor.user().emails[0].verified === false) {
      this.layout('blankLayout');
      this.render('EmailVerificationInfo');
    } else {
      this.next();
    }
  }
}, {
  except: ['home','EmailVerificationInfo','signup','VerifyEmail','forgotpassword','resetPassword']
});