Meteor.publish 'synapseTransactions', ->
  SynapseTransactions.find(ownerId: @userId)
