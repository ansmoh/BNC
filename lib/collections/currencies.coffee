
@Currencies = new Mongo.Collection 'currencies'

Currencies.helpers

  appFeePercent: ->
    if Meteor.settings.appFee then Meteor.settings.appFee else Meteor.settings.public.appFee

  appStep: ->
    if Meteor.settings.appStep then Meteor.settings.appStep else Meteor.settings.public.appStep

  market: (currency) ->
    marketCode = "#{@code.toLowerCase()}_#{(currency or '').toLowerCase()}"
    _.findWhere @markets or [], code: marketCode

  bid: (currency, format) ->
    market = @market currency
    price = if market then market.bid else 0
    if format then numeral(price).format(format) else price

  ask: (currency, format) ->
    market = @market currency
    price = if market then market.ask else 0
    if format then numeral(price).format(format) else price

  price: (type, currency, format) ->
    price =
      if type == 'buy'
        @ask currency
      else if type == 'sell'
        @bid currency
      else
        0
    if format then numeral(price).format(format) else price

  primaryAmount: (type, currency, amount, format) ->
    total = (amount or 0) / @price type, currency
    if format then numeral(total).format(format) else total

  primaryFee: (type, currency, amount, format) ->
    fee = @appFeePercent() * amount
    if format then numeral(fee).format(format) else fee

  primaryTotal: (type, currency, amount, format) ->
    total =
      if type == 'buy'
        amountWithFee = if amount then amount * (1 - @appFeePercent()) else 0
        @primaryAmount type, currency, amountWithFee
      else if type == 'sell'
        amountWithFee = if amount then amount * (1 + @appFeePercent()) else 0
        @primaryAmount type, currency, amountWithFee
      else
        0
    if format then numeral(total).format(format) else total

  secondaryAmount: (type, currency, amount, format) ->
    total = (amount or 0) * @price type, currency
    if format then numeral(total).format(format) else total

  secondaryFee: (type, currency, amount, format) ->
    fee = @appFeePercent() * @secondaryAmount type, currency, amount
    if format then numeral(fee).format(format) else fee

  secondaryTotal: (type, currency, amount, format) ->
    total =
      if type == 'buy'
        (1 + @appFeePercent()) * @secondaryAmount type, currency, amount
      else if type == 'sell'
        (1 - @appFeePercent()) * @secondaryAmount type, currency, amount
      else
        0
    if format then numeral(total).format(format) else total

  buySchema: ->
    self = @
    schema =
      type:
        type: String
        allowedValues: ['buy']
        autoform:
          type: 'hidden'
          value: 'buy'
      primary:
        type: Object
      'primary.currency':
        type: String
        allowedValues: [@code]
        autoform:
          type: 'hidden'
          value: @code
      'primary.amount':
        type: Number
        decimal: true
        min: @appStep()
        autoform:
          step: @appStep()
        custom: ->
          total = self.secondaryTotal 'buy', @field('secondary.currency').value, @value
          if total > Meteor.user().currencyBalance @field('secondary.currency').value, false
            return "insufficientFundsBalance"
      secondary:
        type: Object
      'secondary.currency':
        type: String
        allowedValues: _.pluck @markets, 'secondaryCurrency'
        autoform:
          type: 'select-radio'
          options: "allowed"
          template: "buttonGroup"
          value: _.pluck(@markets, 'secondaryCurrency').shift()
          label: false
      'secondary.amount':
        type: Number
        decimal: true
        label: "Total value of an order"
        min: @appStep() * 50 # Total value of an order cannot be less than 0.00000050
    new SimpleSchema schema

  sellSchema: ->
    self = @
    schema =
      type:
        type: String
        allowedValues: ['sell']
        autoform:
          type: 'hidden'
          value: 'sell'
      primary:
        type: Object
      'primary.currency':
        type: String
        allowedValues: [@code]
        autoform:
          type: 'hidden'
          value: @code
      'primary.amount':
        type: Number
        decimal: true
        min: @appStep()
        autoform:
          step: @appStep()
        custom: ->
          if @value > Meteor.user().currencyBalance @field('primary.currency').value, false
            return "insufficientFundsBalance"
      secondary:
        type: Object
      'secondary.currency':
        type: String
        allowedValues: _.pluck @markets, 'secondaryCurrency'
        autoform:
          type: 'select-radio'
          options: "allowed"
          template: "buttonGroup"
          value: _.pluck(@markets, 'secondaryCurrency').shift()
          label: false
      'secondary.amount':
        type: Number
        decimal: true
        label: "Total value of an order"
        min: @appStep() * 50 # Total value of an order cannot be less than 0.00000050
    new SimpleSchema schema

  withdrawSchema: ->
    schema =
      primary:
        type: Object
      'primary.currency':
        type: String
        allowedValues: [@code]
        autoform:
          type: 'hidden'
          value: @code
      'primary.amount':
        type: Number
        decimal: true
        min: @appStep()
        autoform:
          step: @appStep()
          label: "Amount"
        custom: ->
          if @value > Meteor.user().currencyBalance @field('primary.currency').value, false
            return "insufficientFundsBalance"
      address:
        type: String
        min: 4
        autoform:
          label: "Address"
        custom: ->
          if Meteor.isServer
            result = HTTP.get "https://shapeshift.io/validateAddress/#{@value}/#{@field('primary.currency').value}"
            if !result.data.isvalid or result.data.error
              return "invalidAddressWithdraw"
    new SimpleSchema schema
