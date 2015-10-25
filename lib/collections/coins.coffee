
@Coins = new Mongo.Collection 'coins'

Coins.helpers

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
    amountWithFee = if amount then amount * (1 - 0.01) else 0
    total = (amountWithFee or 0) / @price type, currency
    if format then numeral(total).format(format) else total

  secondaryAmount: (type, currency, amount, format) ->
    total = (amount or 0) * @price type, currency
    if format then numeral(total).format(format) else total

  fee: (type, currency, amount, format) ->
    fee = 0.01 * @secondaryAmount type, currency, amount
    if format then numeral(fee).format(format) else fee

  total: (type, currency, amount, format) ->
    total =
      if type == 'buy'
        (1 + 0.01) * @secondaryAmount type, currency, amount
      else if type == 'sell'
        (1 - 0.01) * @secondaryAmount type, currency, amount
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
        autoform:
          step: 1 / 100000000
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
        custom: ->
          if @value <= 0
            return "amountZero"
          total = self.total @field('type').value, @field('secondary.currency').value, @field('primary.amount').value
          if total > Meteor.user().currencyBalance @field('secondary.currency').value, false
            return "moreBalance"
    ss = new SimpleSchema schema
    ss.messages
      amountZero: "You cannot buy negative or 0 coins"
      moreBalance: "There is not enough balance for this transaction"
    ss

  sellSchema: ->
    schema =
      type:
        type: String
        defaultValue: 'sell'
      primary:
        type: Object
      'primary.currency':
        type: String
      'primary.amount':
        type: Number
        decimal: true
      secondary:
        type: Object
      'secondary.currency':
        type: String
      'secondary.amount':
        type: Number
        decimal: true
    new SimpleSchema schema

  withdrawSchema: ->
    schema =
      amount:
        type: Number
        decimal: true
      address:
        type: String
    new SimpleSchema schema
