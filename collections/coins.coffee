
@Coins = new Mongo.Collection 'coins'

Coins.helpers
  price: (code, format) ->
    price = 0
    marketCode = @code.toLowerCase() + '_' + code.toLowerCase()
    format = format or '0,0.00000000'
    if @code == 'USD'
      price = 1
    if market = _.findWhere(@markets, code: marketCode)
      price = market.bid
    numeral(price).format format
