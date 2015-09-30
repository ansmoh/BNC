// This file adds basic data to local webapp prior to connecting with our live mongodb


  Currencies.remove({});
  Currencies.insert({code: 'USD', name: 'Dollars', rate: 1, sortOrder: 1})
  Currencies.insert({code: 'BTC', name: 'Bitcoin' , rate: 1, marketid: 2, sortOrder: 2})
  Currencies.insert({code: 'LTC', name: 'Litecoin', rate: 1, marketid: 3, sortOrder: 3})
  Currencies.insert({code: 'DASH', name: 'Dash', rate: 1, marketid: 155, sortOrder: 4})
  Currencies.insert({code: 'DOGE', name: 'Dogecoin', rate: 1, marketid: 132, sortOrder: 5})
  Currencies.insert({code: 'NXT', name: 'Nxt', rate: 1, marketid: 159, sortOrder: 6})
  Currencies.insert({code: 'XRP', name: 'Ripple', rate: 1, marketid: 454, sortOrder: 7})
  Currencies.insert({code: 'BTS', name: 'BitShares', rate: 1, marketid: 119, sortOrder: 8, active: false})
  Currencies.insert({code: 'PPC', name: 'Peercoin', rate: 1, marketid: 28, sortOrder: 9})


if (Voucher.find().count() === 0) {
  Voucher.insert({code: 'ilikefood', amount: 100, currency: 'USD', activated: true, redeemed: false})
  Voucher.insert({code: 'testgvc', amount: 50, currency: 'USD', activated: true, redeemed: false})
}
