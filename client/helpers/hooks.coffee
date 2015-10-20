
AutoForm.addHooks 'tierOne',
  before:
    update: (modifier) ->
      console.log modifier
      modifier
  onSuccess: (type, result) ->
    Meteor.call "sendTokenPhone", (err, result) ->
      unless err then toastr.success result.message else toastr.error err
  onError: (type, err) ->
    toastr.error err
    console.log err

AutoForm.addHooks 'verifyPhone',
  before:
    method: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success result.message
  onError: (type, err) ->
    toastr.error err
    console.log err

AutoForm.addHooks 'verifyBlockScore',
  before:
    method: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success 'Verification successful.', 'Verification'
  onError: (type, err) ->
    toastr.error err
    console.log err

AutoForm.addHooks 'notificationsUpdates',
  before:
    update: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success 'Changes saved', 'Profile'
  onError: (type, err) ->
    toastr.error err
    console.log err

AutoForm.addHooks 'redeemCoupon',
  before:
    update: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success 'Coupon has redeemed successful', 'Coupon'
  onError: (type, err) ->
    toastr.error err
    console.log err
