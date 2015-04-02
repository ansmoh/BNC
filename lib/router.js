Router.configure({
  // the default layout..
  layoutTemplate: 'App'
});

Router.route('/(.*)', function () {
  if (Meteor.userId()) {
    if (Meteor.user().emails[0].verified) {
      Router.go('/trade');
    }
    else{
      Router.go('/not-verified');
    };
  }
  this.layout('Main');
  this.render('Login');
});

Router.route('/not-verified', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  this.layout('Main');
  this.render('EmailVerificationInfo');
});

Router.route('/signup', function () {
  if (Meteor.userId()) {
    if (Meteor.user().emails[0].verified == false) {
      Router.go('not-verified');
    }
    Router.go('/trade');
  }
  this.layout('Main');
  this.render('SignUp');
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
  this.layout('Main');
  this.render('ForgotPassword');
}

Router.route('/reset-password', forgotPassword);
Router.route('/reset-password/:token', forgotPassword);

Router.route('/verify-email/:token', function () {
  if (this.params.token) {
    Session.set('verifyEmail', this.params.token);
  };
  this.layout('Main');
  this.render('VerifyEmail');
});

Router.route('/trade', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }
  this.render('Trade');
});

Router.route('/wallets', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }
  this.render('Wallets');
});

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
  if (Meteor.user().emails[0].verified == false) {
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
