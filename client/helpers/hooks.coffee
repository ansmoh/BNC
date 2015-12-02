extendDoc = (doc)->
  _.extend(doc, { authTokens: { browserId: localStorage.getItem('browserId'), loginToken: Accounts._storedLoginToken() } })

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

AutoForm.addHooks 'createAchNode',
  before:
    method: (doc) ->
      doc.authTokens ?= {}
      doc.authTokens.browserId = localStorage.getItem('browserId')
      doc.authTokens.loginToken = Accounts._storedLoginToken()
      doc
  onSuccess: (type, result) ->
    toastr.success 'ACH account added.', 'Account creation'
  onError: (type, err) ->
    toastr.error err.message.en
    console.log err

AutoForm.addHooks 'verifySynapsePay',
  before:
    method: (doc) ->
      extendDoc(doc)
  onSuccess: (type, result) ->
    toastr.success 'Verification successful.', 'Verification'
  onError: (type, err) ->
    toastr.error err.message.en
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

AutoForm.addHooks 'redeemVoucher',
  before:
    update: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success 'Voucher has redeemed successful', 'Voucher'
  onError: (type, err) ->
    toastr.error err.message
    console.log err

AutoForm.addHooks 'buyCurrency',
  before:
    method: (doc) ->
      btn = $(@event.currentTarget).find('.modal-footer').find('.btn.btn-success')
      btn.attr('disabled','disabled')
      btn.button('loading')
      currency = Currencies.findOne code: doc.primary.currency
      doc.secondary.amount = currency.secondaryAmount doc.type, doc.secondary.currency, doc.primary.amount
      console.log doc
      doc
  onSuccess: (type, result) ->
    btn = $(@event.currentTarget).find('.modal-footer').find('.btn.btn-success')
    btn.closest('.modal-footer').find('button').removeAttr('disabled')
    btn.button('reset')
    $('#modal').modal('hide')
    toastr.success 'Successful! Your coins will be available momentarily', 'Buy Currency'
  onError: (type, err) ->
    btn = $(@event.currentTarget).find('.modal-footer').find('.btn.btn-success')
    btn.closest('.modal-footer').find('button').removeAttr('disabled')
    btn.button('reset')
    toastr.error err.message
    console.log err

AutoForm.addHooks 'sellCurrency',
  before:
    method: (doc) ->
      btn = $(@event.currentTarget).find('.modal-footer').find('.btn.btn-success')
      btn.attr('disabled','disabled')
      btn.button('loading')
      currency = Currencies.findOne code: doc.primary.currency
      doc.secondary.amount = currency.secondaryAmount doc.type, doc.secondary.currency, doc.primary.amount
      console.log doc
      doc
  onSuccess: (type, result) ->
    btn = $(@event.currentTarget).find('.modal-footer').find('.btn.btn-success')
    btn.closest('.modal-footer').find('button').removeAttr('disabled')
    btn.button('reset')
    $('#modal').modal('hide')
    toastr.success 'Successful! Your coins will be available momentarily', 'Sell Currency'
  onError: (type, err) ->
    btn = $(@event.currentTarget).find('.modal-footer').find('.btn.btn-success')
    btn.closest('.modal-footer').find('button').removeAttr('disabled')
    btn.button('reset')
    toastr.error err.message
    console.log err

AutoForm.addHooks 'withdrawCurrency',
  before:
    method: (doc) ->
      btn = $(@event.currentTarget).find('.modal-footer').find('.btn.btn-success')
      btn.attr('disabled','disabled')
      btn.button('loading')
      console.log doc
      doc
  onSuccess: (type, result) ->
    btn = $(@event.currentTarget).find('.modal-footer').find('.btn.btn-success')
    btn.closest('.modal-footer').find('button').removeAttr('disabled')
    btn.button('reset')
    toastr.success result.message, 'Withdraw'
  onError: (type, err) ->
    btn = $(@event.currentTarget).find('.modal-footer').find('.btn.btn-success')
    btn.closest('.modal-footer').find('button').removeAttr('disabled')
    btn.button('reset')
    toastr.error err.message
    console.log err
