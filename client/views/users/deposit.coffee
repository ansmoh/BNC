
Template.deposit.onCreated ->

Template.deposit.helpers
  disabledUnlessTier2: ->
    if Meteor.user().statusTierTwo() == 'complete' then '' else 'disabled'

  synapseTransactions: ->
    SynapseTransactions.find { ownerId: Meteor.userId(), $or: [{type: 'DEPOSIT'}, {type: 'WITHDRAWAL' }] }, { sort: { createdAt: -1 }}

Template.deposit.events

Template.deposit.onRendered ->
