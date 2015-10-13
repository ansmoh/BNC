/*
Router.onBeforeAction(function(){
  Meteor.subscribe('settingsInfo');
  this.next();
})*/
/*
Router.route('/', function () {
  if (Meteor.userId()) {
    if (Meteor.user().emails[0].verified) {
      Router.go('/trade');
    }
    else{
      Router.go('/not-verified');
    };
  }
  this.layout('blankLayout');
  this.render('Login');
}, {
  name: 'home'
});*/
/*
Router.route('/not-verified', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user().emails[0].verified) {
    Router.go('/trade');
  }

  this.layout('blankLayout');
  this.render('EmailVerificationInfo');
}, {
  name: 'not-verified'
});

Router.route('/signup', function () {
  if (Meteor.userId()) {
    if (Meteor.user().emails[0].verified == false) {
      Router.go('not-verified');
    }
    Router.go('/trade');
  }
  this.layout('blankLayout');
  this.render('SignUp');
}, {
  name: 'signup'
});

var forgotPassword = function () {
  if (Meteor.userId()) {
    if (Meteor.user().emails[0].verified == false) {
      Router.go('not-verified');
    }
    Router.go('/trade');
  }
  if (this.params.token) {
    Session.set('resetPassword', this.params.token);
  };
  this.layout('blankLayout');
  this.render('ForgotPassword');
}

Router.route('/reset-password', forgotPassword, {name: 'forgotpassword'});
Router.route('/reset-password/:token', forgotPassword, {name: 'resetPassword'});

Router.route('/verify-email/:token', function () {
  if (this.params.token) {
    Session.set('verifyEmail', this.params.token);
  };
  this.layout('blankLayout');
  this.render('VerifyEmail');
}, {
  name: 'VerifyEmail'
});
*/
/*
Router.route('/trade', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user() && Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }
  this.render('Trade');
});*/

// Router.route('/wallets', function () {
//   if (!Meteor.userId()) {
//     Router.go('/');
//   }
//   if (Meteor.user().emails[0].verified == false) {
//     Router.go('not-verified');
//   }
//   this.render('Wallets');
// });

//Router.route('/deposit', function () {
  /*
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }*/
  //this.render('Pay');
//});
/*
Router.route('/verification', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user() && Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }
  this.render('Profile');
});
*/

//Router.route('/account', function () {
  /*
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }*/
  //this.render('Account');
//});
/*
Router.route('/coins', {
  name: 'coins',
  waitOn: function () {
    return Meteor.subscribe('coins');
  }
})*/
/*
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
  except: ['home','not-verified','signup','VerifyEmail','forgotpassword','resetPassword']
});*/

Router.route("*", {
  waitOn: function() {
    return [Meteor.subscribe('images')];
  }
});