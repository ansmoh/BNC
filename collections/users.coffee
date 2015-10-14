
Schemas.UserProfile = new SimpleSchema
  name:
    type: String
    optional: true
  summary:
    type: String
    optional: true
  homeAddress:
    type: Schemas.Address
    optional: true
  billingAddress:
    type: Schemas.Address
    optional: true
  dob:
    type: Date
    optional: true
  currency:
    type: String
    defaultValue: 'usd'
    autoform:
      options:
        usd: '$ (US Dollars)'
        eur: '€ (Euro)'
        gbp: '£ (GBP)'
        jpy: '¥ (Yen)'

Schemas.User = new SimpleSchema [

  Schemas.Timestampable,

    username:
      type: String
      optional: true
    avatar:
      type: String
      optional: true
    hashEmail:
      type: String
      optional: true
      autoValue: ->
        if Meteor.isClient and !@value
          doc = Meteor.users.findOne @userId
          if doc?.emails?.length
            Avatar.hash doc.emails[0].address
    emails:
      type: [Object]
      optional: true
    "emails.$.address":
      type: String
      regEx: SimpleSchema.RegEx.Email
      label: "Email"
    "emails.$.verified":
      type: Boolean
      optional: true
      defaultValue: false
    profile:
      type: Schemas.UserProfile
      optional: true
    services:
      type: Object
      optional: true
      blackbox: true
    roles:
      type: [String]
      optional: true
      blackbox: true
]

Meteor.users.attachSchema(Schemas.User)

Meteor.users.helpers
  totalBalanceInUSD: ->
    total = 0
    if Meteor.user()
      Transactions.find user: @_id, status: 'complete'
        .forEach (trn) ->
          amount = parseFloat(trn.amount)
          if amount and trn.currency
            if trn.currency == 'USD'
              total += amount
            else
              total += amount * Currencies.findOne(code: trn.currency).rate
    total