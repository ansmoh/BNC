Schemas.SynapseTransaction = new SimpleSchema
  amount:
    type: Number
    decimal: true
  currency:
    type: String
  type:
    type: String
    defaultValue: 'INTERNAL',
    allowedValues: ['INTERNAL', 'DEPOSIT', 'WITHDRAWAL']
  status:
    type: String,
    defaultValue: 'CREATED',
    allowedValues: ['CREATED', 'PROCESSING-DEBIT', 'PROCESSING-CREDIT', 'SETTLED']
  createdAt:
    type: Date
  processAt:
    type: Date
  synapseId:
    type: String
  fromNodeId:
    type: String
  toNodeId:
    type: String
  ownerId:
    type: String
    autoValue: ->
      if @isInsert and @userId then @userId else @unset()

@SynapseTransactions = new Mongo.Collection 'synapse_transactions'
SynapseTransactions.attachSchema Schemas.SynapseTransaction

SynapseTransactions.helpers
  settle: (synapseId)->
    transaction = SynapseTransactions.findOne({ synapseId: synapseId })
    owner = Meteor.users.findOne transaction.ownerId
    amount = transaction.amount.amount
    currency = transaciton.amount.currency

    if transaction.status != 'SETTLED' || transaction.type == 'INTERNAL'
      throw new Meteor.Error 404, "Illegal attempt to to settle transaction"

    if transaction.type == 'WITHDRAWAL'
      amount = -amount

    Meteor.users.update owner._id, $inc: { 'synapseBalance': amount }

    if _.findWhere(owner.balance, currency: currency)
      Meteor.users.update _id: owner._id, 'balance.currency': currency,
        $inc:
          'balance.$.amount': amount
    else
      Meteor.users.update _id: owner._id,
        $push:
          'balance':
            currency: currency
            amount: amount
