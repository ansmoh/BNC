
Meteor.users.allow
  update: (userId, doc, fields, modifier) ->
    console.log fields
    console.log doc
    console.log modifier
    doc._id == userId and _.without(fields, 'username', 'profile', 'avatar', 'hashEmail', 'updatedAt').length == 0