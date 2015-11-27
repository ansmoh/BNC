
Template.deposit.onCreated ->

Template.deposit.helpers
  disabledUnlessTier2: ->
    if Meteor.user().statusTierTwo() == 'complete' then '' else 'disabled'

Template.deposit.events



Template.deposit.onRendered ->
  yourfunction()
