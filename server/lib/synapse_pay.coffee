class @InitSynapsePay

  constructor: (ip, fingerprint)->
    @sp = new SynapsePay
      development_mode: (process.env.NODE_ENV != 'production')
      ip_address: ip
      fingerprint: fingerprint

  createUser: (user, doc)->
    @sp.users.create
      logins: [ { "email": user.emailAddress() } ],
      phone_numbers: [ user.profile.phoneNumber ],
      legal_names: [ "#{doc.firstName} #{doc.lastName}" ],
      extra: { supp_id: user._id }

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

  createAttachment: (attachment)->
    @sp.users.attachFile attachment

  createUserNode: (user, doc)->

  createBacNode: (user, doc)->

  createUserDeposit: (user, doc)->

  createUserWithdrawal: (user, doc)->

  createBacWithdrawal: (user, doc)->
