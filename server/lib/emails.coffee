
class EmailClass

  constructor: (@key, @from = 'donotreply@buyanycoin.com') ->

  verifyPhone: (userId) ->
    user = Meteor.users.findOne userId
    to = user.emailAddress()
    subject = 'BuyAnyCoin: Tier 1 Verified'
    content = "Hello #{user.displayName()},\n\nYour Tier 1 details have been verified succesfully.\n\nGood Job!"
    @send to, subject, content

  verifyBlockScore: (userId) ->
    user = Meteor.users.findOne userId
    to = user.emailAddress()
    subject = 'BuyAnyCoin: Tier 2 Verified'
    content = "Hello #{user.displayName()},\n\nYour Tier 2 details have been verified succesfully.\n\nEven Better!"
    @send to, subject, content

  redeemCoupon: (userId, coupon) ->
    user = Meteor.users.findOne userId
    to = user.emailAddress()
    subject = 'BuyAnyCoin: Voucher redeemed'
    content = "Hello #{user.displayName()},\n\nYay! You voucher has been redeemed for #{coupon.amount_off} #{coupon.currency}"
    @send to, subject, content

  buyCurrency: (userId, orderId) ->
    user = Meteor.users.findOne userId
    to = user.emailAddress()
    order = Orders.findOne orderId
    subject = "BuyAnyCoin: #{order.primary.currency} Purchased"
    content = "Hello #{user.displayName()},\n\nYou have purchased #{order.primary.amount} #{order.primary.currency}"
    @send to, subject, content

  sellCurrency: (userId, orderId) ->
    user = Meteor.users.findOne userId
    to = user.emailAddress()
    order = Orders.findOne orderId
    subject = "BuyAnyCoin: #{order.primary.currency} Sold"
    content = "Hello #{user.displayName()},\n\nYou have sold #{order.primary.amount} #{order.primary.currency}"
    @send to, subject, content

  sendCompliance: (userId, complianceId) ->
    user = Meteor.users.findOne userId
    to = 'compliance@buyanycoin.com'
    compliance = Compliances.findOne complianceId
    subject = "BuyAnyCoin: Compliance Alert!"
    content = "#{user.displayName()} has failed #{compliance.tier()}.\n\nTheir user ID is: #{compliance.userId} and their email is #{user.emailAddress()}"
    @send to, subject, content

  ###
  depositKnox: (userId, amount) ->
    user = Meteor.users.findOne userId
    to = user.emailAddress()
    subject = 'BuyAnyCoin: Deposit'
    content = "Hello #{user.displayName()},\n\n#{numeral(amount).format('$0,0[.]00')} has been successfully deposited to your account!"
    @send to, subject, content
  ###

  send: (to, subject, content) ->
    Email.send
      from: @from
      to: to
      subject: subject
      text: content

@AppEmail = new EmailClass 'test_key'
