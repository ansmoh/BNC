
Template.currencyWithdraw.onCreated ->

Template.currencyWithdraw.helpers
  primaryAmount: ->
    AutoForm.getFieldValue('primary.amount', 'withdrawCurrency')

Template.currencyWithdraw.events

Template.currencyWithdraw.onRendered ->