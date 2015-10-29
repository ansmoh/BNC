
Meteor.publish 'currencies', ->
  Currencies.find()