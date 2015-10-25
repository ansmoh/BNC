
Template.currencyBuy.onCreated ->

Template.currencyBuy.helpers
  secondaryCurrency: ->
    AutoForm.getFieldValue('secondary.currency', 'buyCurrency')
  secondaryAmount: ->
    @currency.secondaryAmount AutoForm.getFieldValue('type'), AutoForm.getFieldValue('secondary.currency'), AutoForm.getFieldValue('primary.amount'), '0.00000000'
  fee: ->
    @currency.fee AutoForm.getFieldValue('type'), AutoForm.getFieldValue('secondary.currency'), AutoForm.getFieldValue('primary.amount'), '0.00000000'
  total: ->
    @currency.total AutoForm.getFieldValue('type'), AutoForm.getFieldValue('secondary.currency'), AutoForm.getFieldValue('primary.amount'), '0.00000000'

Template.currencyBuy.events
  'click .buy-max': (event, tmpl) ->
    currency = tmpl.$('[name="secondary.currency"]:checked').val()
    tmpl.$('[name="primary.amount"]').val(@currency.primaryAmount 'buy', currency, Meteor.user().currencyBalance(currency)).trigger('change')

Template.currencyBuy.onRendered ->