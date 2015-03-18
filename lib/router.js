Router.configure({
  // the default layout..
  layoutTemplate: 'App'
});

Router.route('/', function () {
    if (Meteor.userId()) {
      Router.go('/wallets');
    }
  this.layout('Main');
  this.render('Login');
});

Router.route('/signup', function () {
    if (Meteor.userId()) {
      Router.go('/wallets');
    }
  this.layout('Main');
  this.render('SignUp');
});

var forgotPassword = function () {
  if (Meteor.userId()) {
    Router.go('/wallets');
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

Router.route('/wallets', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  this.render('Wallets');
});

Router.route('/deposit', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  this.render('Pay');
});

Router.route('/verification', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  this.render('Profile');
});

Router.route('/account', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  this.render('Account');
});

Router.route("*", {
  waitOn: function() {
    return [Meteor.subscribe('images')];
  }
});
