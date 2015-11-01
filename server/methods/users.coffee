
Meteor.methods

  sendTokenPhone: () ->
    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user
    try
      result = HTTP.call "POST", "https://api.authy.com/protected/json/phones/verification/start",
        data:
          #api_key: '2a7cc1467513fd1c366de7620bb9361c'
          api_key: "IWdlZFJOakroBRRoBL5CzPI9jxeKuBCJ"
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
      result = HTTP.call "GET", "https://api.authy.com/protected/json/phones/verification/check",
        params:
          #api_key: '2a7cc1467513fd1c366de7620bb9361c'
          api_key: "IWdlZFJOakroBRRoBL5CzPI9jxeKuBCJ"
          phone_number: user.profile.phoneNumber
          country_code: 1
          verification_code: doc.token
      Meteor.users.update @userId,
        $set:
          'phone.verified': true
          'phone.verifiedAt': new Date
      AppEmail.verifyPhone @userId
    catch e
      throw new Meteor.Error 404, e.message

  verifyBlockScore: (doc) ->
    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user
    try
      result = HTTP.call "POST", "https://api.blockscore.com/people",
        data:
          name_first: doc.firstName
          name_last: doc.lastName
          birth_year: moment(doc.dob).format('YYYY')
          birth_month: moment(doc.dob).format('MM')
          birth_day: moment(doc.dob).format('DD')
          document_type: doc.documentType
          document_value: doc.documentValue
          address_street1: doc.address.line
          address_city: doc.address.city
          address_subdivision: doc.address.state
          address_postal_code: doc.address.zip
          address_country_code: doc.address.country
        auth: "sk_test_b98fde330db2149ab12e09475ef20d3a:"
        headers:
          Accept: 'application/vnd.blockscore+json;version=4'
      Meteor.users.update @userId,
        $set:
          'account.blockscore': result.data
      AppEmail.verifyBlockScore @userId
    catch e
      throw new Meteor.Error 404, e.message

  depositKnox: (trnId) ->
    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user
    try
      result = HTTP.call "GET", "https://knoxpayments.com/admin/api/get_payment_details.php",
        params:
          API_key: '8aa796419a91eb780d954179aa21d696b204787a'
          API_pass: '9b527490bb2bfe73097fd8314ef8ae9a0fd35301'
          trans_id: trnId
      console.log result.data
      ###
      AppEmail.depositKnox @userId
      ###
    catch e
      throw new Meteor.Error 404, e.message

  updateUserBalance: (currency, amount, serverKey) ->
    throw new Meteor.Error 403, "Access denied" if Meteor.settings.serverKey isnt serverKey
    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user
    if _.findWhere(user.balance, currency: currency)
      Meteor.users.update _id: @userId, 'balance.currency': currency,
        $inc:
          'balance.$.amount': amount
    else
      Meteor.users.update _id: @userId,
        $push:
          'balance':
            currency: currency
            amount: amount
