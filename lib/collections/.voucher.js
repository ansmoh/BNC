voucher = new SimpleSchema({
  code: {
    type: String
  },
  amount: {
    type: Number,
  },
  currency: {
    type: String
  }, 
  activated: {
    type: Boolean
  },
  redeemed: {
    type: Boolean
  }
});

Voucher = new Mongo.Collection('voucher');
Voucher.attachSchema(voucher);