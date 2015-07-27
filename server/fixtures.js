if (Currencies.find().count() === 0) {
  Currencies.insert({code: 'USD', name: 'Dollars', rate: 1, sortOrder: 1})
  Currencies.insert({code: 'BTC', name: 'Bitcoin' , rate: 389.01, sortOrder: 2})
  Currencies.insert({code: 'LTC', name: 'Litecoin', rate: 3.89, marketid: 3, sortOrder: 3})
  Currencies.insert({code: 'DASH', name: 'Dash', rate: 2, marketid: 155, sortOrder: 4})
  Currencies.insert({code: 'DOGE', name: 'Dogecoin', rate: 0.00001, marketid: 132, sortOrder: 5})
  Currencies.insert({code: 'NXT', name: 'Nxt', rate: 0.012932, marketid: 159, sortOrder: 6})
  Currencies.insert({code: 'XRP', name: 'Ripple', rate: 0.010950, marketid: 454, sortOrder: 7})
  Currencies.insert({code: 'BTS', name: 'BitShares', rate: 0.008363, marketid: 119, sortOrder: 8, active: false})
  Currencies.insert({code: 'PPC', name: 'Peercoin', rate: 0.390607, marketid: 28, sortOrder: 9})
}
else{
  if (Currencies.find({code: 'NXT'}).count() === 0) {
    Currencies.insert({code: 'NXT', name: 'Nxt', rate: 0.012932, sortOrder: 6})
  }
  if (Currencies.find({code: 'XRP'}).count() === 0) {
    Currencies.insert({code: 'XRP', name: 'Ripple', rate: 0.010950, sortOrder: 7})
  }
  if (Currencies.find({code: 'BTS'}).count() === 0) {
    Currencies.insert({code: 'BTS', name: 'BitShares', rate: 0.008363, sortOrder: 8, active: false})
  }
  if (Currencies.find({code: 'PPC'}).count() === 0) {
    Currencies.insert({code: 'PPC', name: 'Peercoin', rate: 0.390607, sortOrder: 9})
  }
}

if (Voucher.find().count() === 0) {
  Voucher.insert({code: 'ilikefood', amount: 100, currency: 'USD', activated: true, redeemed: false})
  Voucher.insert({code: 'testgvc', amount: 50, currency: 'USD', activated: true, redeemed: false})
}

// if (Transactions.find().count() === 0) {
//   Transactions.insert({user: 'q4nQgWB9PpxdfuWv2', currency: 'USD', amount: 10.0, note: 'deposit', status: 'complete', timestamp: Date()})
//   Transactions.insert({user: 'q4nQgWB9PpxdfuWv2', currency: 'USD', amount: 5.5, note: 'deposit', status: 'pending', timestamp: Date()})
//   Transactions.insert({user: 'q4nQgWB9PpxdfuWv2', currency: 'BTC', amount: 10.0, note: 'deposit', status: 'complete', timestamp: Date()})
// }
