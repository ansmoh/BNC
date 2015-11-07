
@Compliances = new Mongo.Collection 'compliances'

Schemas.Compliance = new SimpleSchema [

  Schemas.Timestampable, Schemas.BelongsUser,

    type:
      type: String
    data:
      type: Object
      blackbox: true
      optional: true
]

Compliances.attachSchema Schemas.Compliance

Compliances.helpers
  tier: ->
    switch @type
      when 'phone.verify'
        return 'tier one'
      when 'blockscore.verify'
        return 'tier two'

if Meteor.isServer
  Compliances.after.insert (userId, doc) ->
    AppEmail.sendCompliance userId, @_id