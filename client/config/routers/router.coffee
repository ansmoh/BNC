
Router.configure
  layoutTemplate: 'defaultLayout'
  loadingTemplate: 'loading'
  notFoundTemplate: 'notFound'
  waitOn: ->
    [
      Meteor.subscribe 'currentUser'
      Meteor.subscribe 'currencies'
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
  waitOn: ->
    [
      Meteor.subscribe 'attachments'
    ]

Router.route '/account',
  name: 'account'
  template: 'account'

Router.route '/trade',
  name: 'trade'
  template: 'currencies'

Router.route '/deposit',
  name: 'deposit'
  template: 'deposit'
  onAfterAction: ->
    console.log @params.query
  waitOn: ->
    [
      Meteor.subscribe 'attachments'
      Meteor.subscribe 'synapseTransactions'
    ]

Router.route '/synapsepay/hook',
  name: 'synapseHook'
  onAfterAction: ->
    console.log @params.query
  waitOn: ->
    [
      Meteor.subscribe 'synapseTransactions'
    ]
