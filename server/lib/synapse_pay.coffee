class @InitSynapsePay

  constructor: (ip, fingerprint, user_id = null)->
    #development_mode: (process.env.NODE_ENV != 'production')
    console.log(user_id)
    @sp = new SynapsePay( { development_mode: true, ip_address: ip, fingerprint: fingerprint }, user_id)

  createUser: (user, doc)->
    @sp.users.create
      logins: [ { "email": user.emailAddress() } ],
      phone_numbers: [ user.profile.phoneNumber ],
      legal_names: [ "#{doc.firstName} #{doc.lastName}" ],
      extra: { supp_id: user._id }

  getUser: (user_id)->
    @sp.users.get
      user_id: user_id

  refreshUser: (token)->
    @sp.users.refresh refresh_token: token

  addVirtualDocument: (doc)->
    @sp.users.addDoc
      doc:
        birth_day: moment(doc.dob).format('DD')
        birth_month: moment(doc.dob).format('MM')
        birth_year: moment(doc.dob).format('YYYY')
        name_first: doc.firstName
        name_last: doc.lastName
        address_street1: doc.address.line
        address_postal_code: doc.address.zip
        address_country_code: doc.address.country
        document_type: doc.documentType.toUpperCase()
        document_value: doc.documentValue

  addAttachment: (attachment)->
    return @sp.users.attachFile(attachment)

  answerMfaQuestion: (doc)->
    mfa = Session.get('mfaQuestion')
    @sp.nodes.add
      access_token: mfa.access_token
      mfa_answer: doc.answer

  createUserAchNode: (doc)->
    @sp.nodes.add
      type: doc.type,
      info:
        bank_id: doc.info.bankId
        bank_pw: doc.info.bankPw
        bank_name: doc.info.bankName

  createUserSynapseNode: (user_id)->
    @sp.nodes.add
      type: 'SYNAPSE-US',
      info:
        nickname: 'user-' + user_id

  createBacPoolNode: ->
    @sp.nodes.add
      type: 'SYNAPSE-US',
      info:
        nickname: 'bac-pool'

  createBacFeeNode: ->
    @sp.nodes.add
      type: 'SYNAPSE-US',
      info:
        nickname: 'bac-fee'

  getWebhook: ->
    if process.env.NODE_ENV == 'development'
      return 'http://requestb.in/xvzprjxw'
    "https://" + this.connection.httpHeaders.host + "/synapse/hook"

  createUserDeposit: (user, doc, clientIp)->
    txnData =
      to:
        type: 'SYNAPSE-US'
        id: user.synNode._id
      amount:
        amount: doc.amount
        currency: 'USD'
      extra:
        webhook: @getWebhook()
        ip: clientIp

    @sp.trans.create user.achNode._id, txnData

  createUserWithdrawal: (user, doc, clientIp)->
    txnData =
      to:
        type: 'ACH-US'
        id: user.achNode._id
      amount:
        amount: doc.amount
        currency: 'USD'
      extra:
        webhook: @getWebhook()
        ip: clientIp

    @sp.trans.create user.synNode._id, txnData

  createBacWithdrawal: (user, doc)->
