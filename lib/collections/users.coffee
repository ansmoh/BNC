
Schemas.UserProfile = new SimpleSchema
  name:
    type: String
    optional: true
    autoValue: ->
      firstName = @field 'profile.firstName'
      lastName = @field 'profile.lastName'
      if !@value and firstName.value and lastName.value
        "#{firstName.value} #{lastName.value}"
  firstName:
    type: String
    optional: true
  lastName:
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
  phoneNumber:
    type: String
    optional: true
  onNews:
    type: Boolean
    optional: true
    defaultValue: false
  onPromotions:
    type: Boolean
    optional: true
    defaultValue: false
  currency:
    type: String
    defaultValue: 'usd'
    autoform:
      options:
        usd: '$ (US Dollars)'
        eur: '€ (Euro)'
        gbp: '£ (GBP)'
        jpy: '¥ (Yen)'

Schemas.BlockScore = new SimpleSchema
  firstName:
    type: String
  lastName:
    type: String
  dob:
    type: String
    autoform:
      type: 'bootstrap-datepicker'
  documentType:
    type: String
    allowedValues: ['ssn']
    autoform:
      options:
        ssn: "SSN"
  documentValue:
    type: String
  address:
    type: Object
  'address.line':
    type: String
  'address.city':
    type: String
  'address.state':
    type: String
    autoform:
      options: ->
        States.find({}, sort: name: 1).map (state) ->
          label: state.name, value: state._id
  'address.zip':
    type: String
  'address.country':
    type: String
    autoform:
      options: ->
        Countries.find({}, sort: name: 1).map (country) ->
          label: country.name, value: country._id

Schemas.LoginAttempt = new SimpleSchema
  loginAttempt:
    type: Object
    optional: true
  'loginAttempt.failureLoginAt':
    type: Date
    optional: true
  'loginAttempt.attempts':
    type: Number
    optional: true

Schemas.Balance = new SimpleSchema
  currency:
    type: String
  amount:
    type: Number
    decimal: true
    defaultValue: 0

Schemas.User = new SimpleSchema [

  Schemas.Timestampable, Schemas.LoginAttempt,

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
    phone:
      type: Object
      optional: true
    'phone.verifiedAt':
      type: Date
    'phone.verified':
      type: Boolean
    emails:
      type: [Object]
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
    account:
      type: Object
      optional: true
    'account.blockscore':
      type: Object
      optional: true
      blackbox: true
    'account.lastDepositAt':
      type: Date
      optional: true
    coupons:
      type: [Object]
      optional: true
    'coupons.$.id':
      type: String
    'coupons.$.when':
      type: Date
    services:
      type: Object
      optional: true
      blackbox: true
    roles:
      type: [String]
      optional: true
      blackbox: true
    balance:
      type: [Schemas.Balance]
      optional: true
]

Meteor.users.attachSchema Schemas.User

Meteor.users.helpers

  displayName: ->
    if @profile?.name
      @profile.name
    else if @username
      @username
    else if @emails?.length
      @emails[0].address
    else
      'User'

  emailAddress: ->
    @emails?[0].address

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

  # Should calculate on after.insert hook transactions
  totalDeposit: ->
    total = 0
    Transactions.find user: @_id, currency: "USD", status: 'complete'
      .forEach (trn) ->
        total += trn.amount * 1
    total

  lastDepositAt: ->
    @account?.lastDepositAt

  statusTierOne: ->
    if @profile?.firstName and @profile?.lastName and @profile?.phoneNumber and @emails?[0].verified
      if @phone?.verified
        'complete'
      else
        'processing'
    else
      'pending'

  statusTierTwo: ->
    if @account?.blockscore?.status == 'valid' then 'complete' else 'pending'

  statusTierThree: ->
    if @lastDepositAt() > moment().subtract(30, 'days') and @totalDeposit >= 5000
      'complete'
    else
      'pending'

  profileCompletedPercent: ->
    percent = 30
    if @statusTierTwo() == 'complete'
      percent += 50
    if @statusTierThree() == 'complete'
      percent += 20
    percent

  ###
  isCompleteTier: (name) ->
    switch name
      when 'one'
        @profile?.firstName and @profile?.lastName and @profile?.phoneNumber
      when 'two'
        false
      when 'three'
        false
  ###

  oneTierSchema: ->
    new SimpleSchema
      profile:
        type: Object
      'profile.firstName':
        type: String
      'profile.lastName':
        type: String
      'profile.phoneNumber':
        type: String
      'profile.name':
        type: String
        optional: true
        autoValue: ->
          "#{@siblingField('firstName').value} #{@siblingField('lastName').value}"

  verifyPhoneSchema: ->
    new SimpleSchema
      token:
        type: String
        min: 4

  notificationsUpdatesSchema: ->
    new SimpleSchema
      profile:
        type: Object
      'profile.onNews':
        type: Boolean
        label: 'News/Updates'
      'profile.onPromotions':
        type: Boolean
        label: 'Promotions'


###
# Fallback afModal doesnt support schema key
###
@BlockScore = new Mongo.Collection null
BlockScore.attachSchema Schemas.BlockScore

@UserCoupons = new Mongo.Collection null
UserCoupons.attachSchema new SimpleSchema
  coupon:
    type: String
