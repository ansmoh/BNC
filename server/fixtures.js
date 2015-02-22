if (Currencies.find().count() === 0) {
  Currencies.insert({code: 'USD', name: 'Dollars', rate: 1})
  Currencies.insert({code: 'BTC', name: 'Bitcoin' , rate: 389.01})
  Currencies.insert({code: 'LTC', name: 'Litecoin', rate: 3.89})
  Currencies.insert({code: 'DRK', name: 'Darkcoin', rate: 2})
  Currencies.insert({code: 'DOGE', name: 'Dogecoin', rate: .00001})
}

if (Voucher.find().count() === 0) {
  Voucher.insert({code: 'ilikefood', amount: 100, currency: 'USD', activated: true, redeemed: false})
  Voucher.insert({code: 'testgvc', amount: 50, currency: 'USD', activated: true, redeemed: false})
}
if (Transactions.find().count() === 0) {
  Transactions.insert({ user : "mZgMPba9pbWyehfgB", currency : "USD", amount : 50000, note : 'Deposit: Initial', status: 'complete' })
  Transactions.insert({ user : "mZgMPba9pbWyehfgB", currency : "USD", amount : 1000, note : 'Deposit', status: 'pending' })
}

// if (Transactions.find().count() === 0) {
//   Transactions.insert({user: 'q4nQgWB9PpxdfuWv2', currency: 'USD', amount: 10.0, note: 'deposit', status: 'complete', timestamp: Date()})
//   Transactions.insert({user: 'q4nQgWB9PpxdfuWv2', currency: 'USD', amount: 5.5, note: 'deposit', status: 'pending', timestamp: Date()})
//   Transactions.insert({user: 'q4nQgWB9PpxdfuWv2', currency: 'BTC', amount: 10.0, note: 'deposit', status: 'complete', timestamp: Date()})
// }
