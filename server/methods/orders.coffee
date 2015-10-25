
Meteor.methods

  buy: (doc) ->
    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user
    currency = Coins.findOne code: doc?.primary?.currency
    throw new Meteor.Error 404, "Currency not found" unless currency
    doc.secondary.amount = currency.secondaryAmount doc.type, doc.secondary.currency, doc.primary.amount if doc and doc.secondary and doc.primary
    check doc, currency.buySchema()
    doc.price = currency.price doc.type, doc.secondary.currency
    doc.fee =
      amount: currency.fee doc.type, doc.secondary.currency, doc.primary.amount
      currency: doc.secondary.currency
    ###
    if currency.total(doc) > user.currencyBalance(doc.secondary.currency, false)
      throw new Meteor.Error 400, "There is not enough #{doc.secondary.currency} balance for this transaction"
    ###
    console.log doc
    throw new Meteor.Error 500, 'Not implemented'

  sell: (doc) ->
    console.log doc
    throw new Meteor.Error 500, 'Not implemented'

  withdraw: (doc) ->
    console.log doc
    throw new Meteor.Error 500, 'Not implemented'