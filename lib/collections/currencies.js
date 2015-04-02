currency = new SimpleSchema({
  code: {
    type: String
  },
  name: {
    type: String
  },
  rate: {
    type: String
  },
  btcRate: {
    type: String,
    optional: true
  },
  desc: {
    type: String,
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