
Template.profile.onCreated ->

Template.profile.helpers

Template.profile.events
  'click .resend-token': (event, tmpl) ->
    Meteor.call "sendTokenPhone", (err, result) ->
      console.log err, result
      unless err
        toastr.success result.message
      else
        toastr.err err

Template.profile.onRendered ->
  # For performance reasons, the Tooltip and Popover data-apis are opt-in, meaning you must initialize them yourself.
  $('[data-toggle="tooltip"]').tooltip()