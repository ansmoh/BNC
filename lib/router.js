Router.configure({
  // the default layout..
  layoutTemplate: 'defaultLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
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

Router.route('/trade', function () {
  if (!Meteor.userId()) {
    Router.go('/');
  }
  if (Meteor.user() && Meteor.user().emails[0].verified == false) {
    Router.go('not-verified');
  }
  this.render('Trade');
});

Router.route('/deposit', function () {

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
  this.render('Account');
});

Router.route("*", {
  waitOn: function() {
    return [Meteor.subscribe('images')];
  }
});

