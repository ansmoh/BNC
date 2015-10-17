
Meteor.methods

  sendTokenPhone: () ->
    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user
    try
      result = HTTP.call "POST", "https://sandbox-api.authy.com/protected/json/phones/verification/start",
        data:
          #api_key: '2a7cc1467513fd1c366de7620bb9361c'
          api_key: "d57d919d11e6b221c9bf6f7c882028f9"
          via: 'sms'
          phone_number: user.profile.phoneNumber
          country_code: 1
      result.data
    catch e
      throw new Meteor.Error 404, e.message

  verifyPhone: (doc) ->
    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user
    try
      result = HTTP.call "GET", "https://sandbox-api.authy.com/protected/json/phones/verification/check",
        params:
          #api_key: '2a7cc1467513fd1c366de7620bb9361c'
          api_key: "d57d919d11e6b221c9bf6f7c882028f9"
          phone_number: user.profile.phoneNumber
          country_code: 1
          verification_code: doc.token
      Meteor.users.update @userId,
        $set:
          'phone.verified': true
          'phone.verifiedAt': new Date
    catch e
      throw new Meteor.Error 404, e.message
