
Meteor.methods

  redeemVoucher: (doc) ->
    check doc.voucher, String
    voucher = Vouchers.findOne code: doc.voucher
    throw new Meteor.Error 404, 'Voucher not found' unless voucher
    throw new Meteor.Error 500, 'Not implemented'

