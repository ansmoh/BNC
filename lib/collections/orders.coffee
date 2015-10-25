
@Orders = new Mongo.Collection 'orders'

Schemas.Order = new SimpleSchema [

  Schemas.Timestampable, Schemas.BelongsUser,

    type:
      type: String
      allowedValues: ['buy','sell','deposit','withdraw']
    price:
      type: Number
      decimal: true
      optional: true
    primary:
      type: Object
    'primary.currency':
      type: String
    'primary.amount':
      type: Number
      decimal: true
    secondary:
      type: Object
      optional: true
    'secondary.currency':
      type: String
    'secondary.amount':
      type: Number
      decimal: true
    fee:
      type: Object
      optional: true
    'fee.currency':
      type: String
    'fee.amount':
      type: Number
      decimal: true

]

Orders.attachSchema Schemas.Order

if Meteor.isServer

  Orders.after.insert (userId, doc) ->
    switch doc.type
      when 'buy'
        Meteor.call 'updateUserBalance', doc.primary.currency, doc.primary.amount, Meteor.settings.serverKey
        Meteor.call 'updateUserBalance', doc.secondary.currency, -doc.secondary.amount, Meteor.settings.serverKey
      when 'sell'
        Meteor.call 'updateUserBalance', doc.primary.currency, -doc.primary.amount, Meteor.settings.serverKey
        Meteor.call 'updateUserBalance', doc.secondary.currency, doc.secondary.amount, Meteor.settings.serverKey
      when 'deposit'
        Meteor.call 'updateUserBalance', doc.primary.currency, doc.primary.amount, Meteor.settings.serverKey
      when 'withdraw'
        Meteor.call 'updateUserBalance', doc.primary.currency, -doc.primary.amount, Meteor.settings.serverKey
