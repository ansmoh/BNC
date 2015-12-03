
Meteor.publish 'currentUser', ->
  if @userId
    Meteor.users.find _id: @userId,
      fields:
        avatar: 1
        hashEmail: 1
        'phone.verified': 1
        account: 1
        achNode: 1
        synNode: 1
        coupons: 1
        balance: 1
        createdAt: 1
  else
    @ready()
