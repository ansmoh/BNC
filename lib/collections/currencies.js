currency = new SimpleSchema({
  code: {
    type: String
  },
  name: {
    type: String
  },
  rate: {
    type: Number,
    decimal: true
  },
  btcRate: {
    type: Number,
    decimal: true,
    optional: true
  },
  desc: {
    type: String,
    optional: true
  },
  marketid: {
    type: Number,
    optional: true
  },
  sortOrder: {
    type: Number
  },
  active: {
    type: Boolean,
    defaultValue: true
  }
})

Currencies = new Mongo.Collection('currencies');
Currencies.attachSchema(currency);