Meteor.startup ->
  bacEmail = "treasurer@buyanycoin.com";
  bacNames = { firstName: 'Someone', lastName: 'Incharge' }
  if (!Meteor.users.findOne("emails.address" : bacEmail))
    console.log("Adding user to carry BAC info")
    treasurerId = Accounts.createUser
      email: bacEmail,
      password: Random.id(),
      profile:
        name: "#{bacNames.firstName} #{bacNames.lastName}"
        phoneNumber: "111-222-3456"

    user = Meteor.users.findOne(treasurerId)
    serverId = Random.id()
    sp = new InitSynapsePay('127.0.0.1', serverId)

    console.log("Adding BAC account")
    spUser = sp.createUser(user, { firstName: bacNames.firstName, lastName: bacNames.lastName })

    sp.refreshUser spUser.refresh_token

    console.log("Adding BAC Virtual Document")
    spUser = sp.addVirtualDocument
      dob: new Date()
      firstName: bacNames.firstName
      lastName: bacNames.lastName
      documentType: 'SSN'
      documentValue: '2222'
      address:
        line: '42-2 Anywhere st.'
        zip: '90210'
        country: 'US'

    console.log("Adding BAC Attachment")
    spUser = sp.addAttachment("#{__meteor_bootstrap__.serverDir.split('/.meteor')[0]}/private/cam_picture.jpg")

    console.log("Adding BAC nodes")
    spPool = sp.createBacPoolNode().nodes[0]
    spFee = sp.createBacFeeNode().nodes[0]

    Meteor.users.update treasurerId, $set: { 'account.synapsepay': spUser, 'feeNode': spFee, 'poolNode': spPool }
