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
