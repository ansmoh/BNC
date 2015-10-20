
Meteor.users.allow
  update: (userId, doc, fields, modifier) ->
    doc._id == userId and _.without(fields, 'username', 'profile', 'avatar', 'hashEmail', 'updatedAt').length == 0