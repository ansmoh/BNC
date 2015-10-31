
Meteor.methods

  buy: (doc) ->
    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user
    currency = Currencies.findOne code: doc?.primary?.currency
    throw new Meteor.Error 404, "Currency not found" unless currency
    if doc and doc.secondary and doc.primary
      doc.secondary.amount = currency.secondaryAmount 'buy', doc.secondary.currency, doc.primary.amount
    check doc, currency.buySchema()
    market = currency.market doc.secondary.currency
    #cryptsyOrder = Meteor.call 'cryptsy/createorder', market._id, 'buy', doc.primary.amount, currency.price('buy', doc.secondary.currency)
    #if cryptsyOrder
    orderId = Orders.insert
      type: 'buy'
      price: currency.price('buy', doc.secondary.currency)
      #cryptsyOrderId: cryptsyOrder.orderid
      primary: doc.primary
      secondary: doc.secondary
      fee:
        currency: doc.secondary.currency
        amount: currency.secondaryFee 'buy', doc.secondary.currency, doc.primary.amount
    AppEmail.buyCurrency @userId, orderId

  sell: (doc) ->
    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user
    currency = Currencies.findOne code: doc?.primary?.currency
    throw new Meteor.Error 404, "Currency not found" unless currency
    if doc and doc.secondary and doc.primary
      doc.secondary.amount = currency.secondaryAmount 'sell', doc.secondary.currency, doc.primary.amount
    check doc, currency.sellSchema()
    market = currency.market doc.secondary.currency
    #cryptsyOrder = Meteor.call 'cryptsy/createorder', market._id, 'sell', doc.primary.amount, currency.price('sell', doc.secondary.currency)
    orderId = Orders.insert
      type: 'sell'
      price: currency.price('sell', doc.secondary.currency)
      #cryptsyOrderId: cryptsyOrder.orderid
      primary: doc.primary
      secondary: doc.secondary
      fee:
        currency: doc.secondary.currency
        amount: currency.secondaryFee 'sell', doc.secondary.currency, doc.primary.amount
    AppEmail.sellCurrency @userId, orderId

  withdraw: (doc) ->
    console.log doc
    throw new Meteor.Error 500, 'Not implemented'