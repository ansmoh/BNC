
AutoForm.addHooks 'tierOne',
  before:
    update: (modifier) ->
      console.log modifier
      modifier
  onSuccess: (type, result) ->
    toastr.success 'Changes saved'
    Meteor.call "sendTokenPhone"
  onError: (type, err) ->
    toastr.error err
    console.log err

AutoForm.addHooks 'verifyPhone',
  before:
    method: (doc) ->
      console.log doc
      doc
  onSuccess: (type, result) ->
    toastr.success 'Your phone number verified'
  onError: (type, err) ->
    toastr.error err
    console.log err
