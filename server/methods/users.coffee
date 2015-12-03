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
      console.log result.data
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
      result.data
    catch e
      Compliances.insert
        type: 'phone.verify'
        data:
          phoneNumber: user.profile.phoneNumber
          token: doc.token
          message: e.response.data.message
      throw new Meteor.Error 404, e.response.data.message

  createDeposit: (doc)->
    check(doc, Schemas.SynapseDeposit);
    client = initSynapsePay(doc.browserId)
    node = client.nodes.create

  createAchNode: (doc)->
    check(doc, Schemas.SynapseAchNode);

    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user

    sp = new InitSynapsePay(@connection.clientAddress, doc.authTokens.browserId, user.account.synapsepay.remote_id)

    try
      ach = sp.createUserAchNode(doc)
      console.log(ach)
    catch e
      Compliances.insert { type: 'synapsepay.addUserAch', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, "Unable to add ACH account"

    try
      syn = sp.createUserSynapseNode(user._id)
      console.log(syn)
    catch e
      Compliances.insert { type: 'synapsepay.addUserAch', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, e.error?.en

    Meteor.users.update @userId, $set: { 'achNode': ach.nodes[0], 'synNode': syn.nodes[0] }


  verifySynapsePay: (doc, loginToken) ->
    check(doc, Schemas.SynapseUser)

    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user

    sp = new InitSynapsePay(@connection.clientAddress, doc.authTokens.browserId)
    token = FS.Utility.btoa(JSON.stringify({authToken: doc.authTokens.loginToken}))
    attachment_url = "http://" + this.connection.httpHeaders.host + Attachments.findOne(doc.attachment).url(auth: token)
    try
      spUser = sp.createUser(user, doc)
    catch e
      Compliances.insert { type: 'synapsepay.addUser', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, e.error?.en

    sp.refreshUser spUser.refresh_token

    try
      spUser = sp.addVirtualDocument(doc)
    catch e
      Compliances.insert { type: 'synapsepay.addVirtualDoc', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, e.error?.en

    try
      spAttach = sp.addAttachment(attachment_url)
    catch e
      Compliances.insert { type: 'synapsepay.addAttachment', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, e.error?.en

    if spAttach.success || spAttach._id
      spUser = spAttach

    doc.remote_id = spUser._id
    doc.permission = spUser.permission
    doc.status = "valid"

    Meteor.users.update @userId, $set: { 'account.synapsepay': doc }
    AppEmail.verifySynapsePay @userId
    doc

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
