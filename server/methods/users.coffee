addNodesToUser = (ach, sp)->
    try
      syn = sp.createUserSynapseNode(@userId)
    catch e
      Compliances.insert { type: 'synapsepay.addUserSyn', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, "Unable to add Synapse account"

    if syn.error
      throw new Meteor.Error(400, syn.error.en);

  Meteor.users.update @userId, $set: { 'achNode': ach.nodes[0], 'synNode': syn.nodes[0] }

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
      # result = { data: {} }
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

    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user

    sp = new InitSynapsePay(@connection.clientAddress, doc.authTokens.browserId, user.account.synapsepay.remote_id)

    try
      deposit = sp.createUserDeposit(user, doc, @connection.clientAddress)
    catch e
      Compliances.insert { type: 'synapsepay.createDeposit', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, "Unable to deposit funds"

    SynapseTransactions.insert
      amount: deposit.amount.amount
      currency: deposit.amount.currency
      type: 'DEPOSIT'
      status: deposit.recent_status.status
      createdAt: moment(deposit.created_on).toISOString()
      processAt: moment(deposit.process_on).toISOString()
      synapseId: deposit._id
      fromNodeId: deposit.from.id
      toNodeId: deposit.to.id

  createWithdrawal: (doc)->
    check(doc, Schemas.SynapseWithdrawal);

    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user

    sp = new InitSynapsePay(@connection.clientAddress, doc.authTokens.browserId, user.account.synapsepay.remote_id)

    try
      withdrawal = sp.createUserWithdrawal(user, doc, @connection.clientAddress)
    catch e
      Compliances.insert { type: 'synapsepay.createWithdrawal', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, "Unable to withdraw funds"

    console.log withdrawal
    SynapseTransactions.insert
      amount: withdrawal.amount.amount
      currency: withdrawal.amount.currency
      type: 'WITHDRAWAL'
      status: withdrawal.recent_status.status
      createdAt: moment(withdrawal.created_on).toISOString()
      processAt: moment(withdrawal.process_on).toISOString()
      synapseId: withdrawal._id
      fromNodeId: withdrawal.from.id
      toNodeId: withdrawal.to.id

    #Meteor.users.update @userId, $inc: { 'synapseBalance': deposit.amount.amount }
  answerMfa: (doc)->
    check(doc, Schemas.AnswerMfaQuestion);

    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user

    sp = new InitSynapsePay(@connection.clientAddress, doc.authTokens.browserId, user.account.synapsepay.remote_id)

    try
      ach = sp.answerMfaQuestion(doc)
    catch e
      Compliances.insert { type: 'synapsepay.answerMfa', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, "Unable to add ACH account"

    if ach.error
      throw new Meteor.Error(400, ach.error.en)

    addNodesToUser(ach, sp)

    Session.set('mfaQuestion', null)

  createAchNode: (doc)->
    check(doc, Schemas.SynapseAchNode);

    user = Meteor.users.findOne @userId
    throw new Meteor.Error 403, "Access denied" unless user

    sp = new InitSynapsePay(@connection.clientAddress, doc.authTokens.browserId, user.account.synapsepay.remote_id)

    try
      ach = sp.createUserAchNode(doc)
    catch e
      Compliances.insert { type: 'synapsepay.addUserAch', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, "Unable to add ACH account"

    if ach.error
      throw new Meteor.Error(400, ach.error.en)

    if ach.mfa
      Session.set('mfaQuestion', ach.mfa)
    else
      addNodesToUser(ach, sp)

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
      throw new Meteor.Error 404, "Unable to add Synapse user"

    if spUser.error
      throw new Meteor.Error(400, spUser.error.en)

    sp.refreshUser spUser.refresh_token

    try
      spUser = sp.addVirtualDocument(doc)
    catch e
      Compliances.insert { type: 'synapsepay.addVirtualDoc', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, "Unable to add virtual document"

    if spUser.error
      throw new Meteor.Error(400, spUser.error.en)

    try
      spAttach = sp.addAttachment(attachment_url)
    catch e
      Compliances.insert { type: 'synapsepay.addAttachment', data: _.extend(doc, e) }
      console.log(e)
      throw new Meteor.Error 404, "Unable to add attachment"

    if spAttach.error
      throw new Meteor.Error(400, spAttach.error.en)

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
