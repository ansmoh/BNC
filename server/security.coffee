Meteor.users.allow
  update: (userId, doc, fields, modifier) ->
    doc._id == userId and _.without(fields, 'username', 'profile', 'avatar', 'hashEmail', 'updatedAt').length == 0

Attachments.allow
  update: (userId, doc) ->
    !doc.metadata?.owner || doc.metadata.owner == userId
  insert: (userId, doc) ->
    true
  download: (userId, doc)->
    doc.metadata.owner == userId
