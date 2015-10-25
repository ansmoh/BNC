
AutoForm.addHooks 'tierOne',
  before:
    update: (modifier) ->
      console.log modifier
      modifier
  onSuccess: (type, result) ->
    Meteor.call "sendTokenPhone", (err, result) ->
      unless err then toastr.success result.message else toastr.error err.message
  onError: (type, err) ->
    toastr.error err.message
    console.log err

AutoForm.addHooks 'verifyPhone',
  before:
    method: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success result.message
  onError: (type, err) ->
    toastr.error err.message
    console.log err

AutoForm.addHooks 'verifyBlockScore',
  before:
    method: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success 'Verification successful.', 'Verification'
  onError: (type, err) ->
    toastr.error err.message
    console.log err

AutoForm.addHooks 'notificationsUpdates',
  before:
    update: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success 'Changes saved', 'Profile'
  onError: (type, err) ->
    toastr.error err.message
    console.log err

AutoForm.addHooks 'redeemCoupon',
  before:
    update: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success 'Coupon has redeemed successful', 'Coupon'
  onError: (type, err) ->
    toastr.error err.message
    console.log err

AutoForm.addHooks 'buyCurrency',
  before:
    method: (doc) ->
      currency = Coins.findOne code: doc.primary.currency
      doc.secondary.amount = currency.secondaryAmount doc.type, doc.secondary.currency, doc.primary.amount
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success result.message, 'Buy Currency'
  onError: (type, err) ->
    toastr.error err.message
    console.log err

AutoForm.addHooks 'sellCurrency',
  before:
    method: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success result.message, 'Sell Currency'
  onError: (type, err) ->
    toastr.error err.message
    console.log err

AutoForm.addHooks 'withdrawCurrency',
  before:
    method: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success result.message, 'Withdraw'
  onError: (type, err) ->
    toastr.error err.message
    console.log err