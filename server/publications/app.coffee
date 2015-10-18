
Meteor.publish null, ->
  [
    Countries.find()
    States.find()
  ]