
@Coins = new Mongo.Collection 'coins'

Coins.helpers
  price: (code = 'USD', format = '0,0.00000000') ->
    price = 0
    marketCode = @code.toLowerCase() + '_' + code.toLowerCase()
    if @code == 'USD'
      price = 1
    if market = _.findWhere(@markets, code: marketCode)
      price = market.bid
    numeral(price).format format
