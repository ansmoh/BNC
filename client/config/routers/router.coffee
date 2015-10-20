
Router.configure
  layoutTemplate: 'defaultLayout'
  loadingTemplate: 'loading'
  notFoundTemplate: 'notFound'
  waitOn: ->
    [
      Meteor.subscribe 'currentUser'
    ]

AccountsTemplates.configure
  defaultLayout: 'defaultLayout'

Router.route '/',
  name: 'home'
  template: 'login'
  layoutTemplate: 'blankLayout'

Router.route '/verify',
  name: 'verification'
  template: 'verification'

Router.route '/account',
  name: 'account'
  template: 'account'

Router.route '/trade',
  name: 'trade'
  template: 'Trade'

Router.route '/deposit',
  name: 'deposit'
  template: 'Pay'

Router.route '/coins',
  name: 'coins'
  waitOn:
    [
      Meteor.subscribe 'coins'
    ]