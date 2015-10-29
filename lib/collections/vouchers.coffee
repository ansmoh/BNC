
@Vouchers = new Mongo.Collection 'vouchers'

Schemas.Voucher = new SimpleSchema [

  Schemas.Timestampable,

    code:
      type: String
      label: "Code"
    amount:
      type: Number
      optional: true
      decimal: true
      label: "Deposit Amount"
    currency:
      type: String
      optional: true
      defaultValue: 'usd'
      autoform:
        options:
          usd: '$ (US Dollars)'
          eur: '€ (Euro)'
          gbp: '£ (GBP)'
          jpy: '¥ (Yen)'
    duration:
      type: String
      allowedValues: ['forever','once','repeating']
      autoform:
        options:
          forever: 'forever'
          once: 'once'
          repeating: 'repeating'
    duration_in_months:
      type: Number
      optional: true
    max_redemptions:
      type: Number
      optional: true
      defaultValue: 0
    redeem_by:
      type: Date
      optional: true
    times_redeemed:
      type: Number
      optional: true
      defaultValue: 0
]

Vouchers.attachSchema Schemas.Voucher