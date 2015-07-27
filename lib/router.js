Router.configure({
  // the default layout..
  layoutTemplate: 'defaultLayout',
});

Router.onBeforeAction(function(){
  Meteor.subscribe('settingsInfo');
  this.next();
})

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
});

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
  name: 'EmailVerificationInfo'
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

Router.route('/reset-password', forgotPassword);
Router.route('/reset-password/:token', forgotPassword);

Router.route('/verify-email/:token', function () {
  if (this.params.token) {
    Session.set('verifyEmail', this.params.token);
  };
  this.layout('blankLayout');
  this.render('VerifyEmail');
}, {
  name: 'VerifyEmail'
});

Router.route('/trade', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user() && Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }
  this.render('Trade');
});

// Router.route('/wallets', function () {
//   if (!Meteor.userId()) {
//     Router.go('/');
//   }
//   if (Meteor.user().emails[0].verified == false) {
//     Router.go('not-verified');
//   }
//   this.render('Wallets');
// });

Router.route('/deposit', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }
  this.render('Pay');
});

Router.route('/verification', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user() && Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }
  this.render('Profile');
});

Router.route('/account', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }
  this.render('Account');
});

Router.route("*", {
  waitOn: function() {
    return [Meteor.subscribe('images')];
  }
});

