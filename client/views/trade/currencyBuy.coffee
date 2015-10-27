
Template.currencyBuy.onCreated ->

Template.currencyBuy.helpers
  secondaryCurrency: ->
    AutoForm.getFieldValue('secondary.currency', 'buyCurrency')
  primaryAmount: ->
    AutoForm.getFieldValue('primary.amount', 'buyCurrency')
  secondaryAmount: ->
    @currency.secondaryAmount 'buy', AutoForm.getFieldValue('secondary.currency'), AutoForm.getFieldValue('primary.amount'), '0.00000000'
  fee: ->
    @currency.fee 'buy', AutoForm.getFieldValue('secondary.currency'), AutoForm.getFieldValue('primary.amount'), '0.00000000'
  total: ->
    @currency.total 'buy', AutoForm.getFieldValue('secondary.currency'), AutoForm.getFieldValue('primary.amount'), '0.00000000'

Template.currencyBuy.events
  'click .buy-max': (event, tmpl) ->
    currency = tmpl.$('[name="secondary.currency"]:checked').val()
    primaryAmount = @currency.primaryTotal 'buy', currency, Meteor.user().currencyBalance(currency)
    tmpl.$('[name="primary.amount"]').val(primaryAmount).trigger('change')

Template.currencyBuy.onRendered ->