
Router.configure
  layoutTemplate: 'defaultLayout'
  loadingTemplate: 'loading'
  notFoundTemplate: 'notFound'

AccountsTemplates.configure
  defaultLayout: 'defaultLayout'

Router.route '/',
  name: 'home'
  template: 'login'
  layoutTemplate: 'blankLayout'

Router.route '/trade',
  name: 'trade'
  template: 'Trade'

Router.route '/deposit',
  name: 'deposit'
  template: 'Pay'

Router.route '/verification',
  name: 'profile'
  template: 'Profile'

Router.route '/account',
  name: 'account'
  template: 'Account'

Router.route '/coins',
  name: 'coins'
  waitOn:
    [
      Meteor.subscribe 'coins'
    ]