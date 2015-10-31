
Template.currencySell.onCreated ->

Template.currencySell.helpers
  secondaryCurrency: ->
    AutoForm.getFieldValue('secondary.currency', 'sellCurrency')
  primaryAmount: ->
    AutoForm.getFieldValue('primary.amount', 'sellCurrency')
  secondaryAmount: ->
    @currency.secondaryAmount 'sell', AutoForm.getFieldValue('secondary.currency'), AutoForm.getFieldValue('primary.amount'), '0.00000000'
  fee: ->
    @currency.fee 'sell', AutoForm.getFieldValue('secondary.currency'), AutoForm.getFieldValue('primary.amount'), '0.00000000'
  total: ->
    @currency.total 'sell', AutoForm.getFieldValue('secondary.currency'), AutoForm.getFieldValue('primary.amount'), '0.00000000'

Template.currencySell.events
  'click .sell-max': (event, tmpl) ->
    currency = tmpl.$('[name="primary.currency"]').val()
    primaryAmount = Meteor.user().currencyBalance(currency)
    tmpl.$('[name="primary.amount"]').val(primaryAmount).trigger('change')

Template.currencySell.onRendered ->