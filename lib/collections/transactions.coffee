###
@Transactions = new Mongo.Collection 'transactions'

Schemas.Transaction = new SimpleSchema [

  Schemas.Timestampable, Schemas.BelongsUser,

    orderId:
      type: String
      regEx: SimpleSchema.RegEx.Id
    currency:
      type: String
    amount:
      type: Number
      decimal: true
    type:
      type: String
      allowedValues: ['debit','credit','deposit','withdraw']

]
###