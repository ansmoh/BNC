
Accounts.onCreateUser (options, user) ->
  # We still want the default hook's 'profile' behavior.
  if options.profile
    user.profile = options.profile
  # Send welcome
  Email.send
    from: 'support@buyanycoin.com',
    to: 'admin@buyanycoin.com',
    subject: 'BuyAnyCoin: New account created',
    text: "Hello Admin,\n\n Welcome the new user #{user.emails[0].address} signed-up at #{user.createdAt}"
  user

Accounts.onLogin (attempt) ->
  if attempt.user
    user = attempt.user

###
# emailTemplates
###
Accounts.emailTemplates.siteName = "BuyAnyCoin";
Accounts.emailTemplates.from = "BuyAnyCoin <donotreply@buyanycoin.com>";

Accounts.emailTemplates.resetPassword.subject = (user) ->
  "Password Reset - BuyAnyCoin"
Accounts.emailTemplates.resetPassword.text = (user, url) ->
  "Looks like you forgot your password, no worries. Just click the link below to setup a new one.\n\n"+url+" \n\nThank you,\n\n BuyAnyCoin Team"

Accounts.emailTemplates.verifyEmail.subject = (user) ->
  "Please verify your email"

Accounts.emailTemplates.verifyEmail.text = (user, url) ->
  "Hello,\n\nTo verify your account email, simply click the link below. \n\n"+url+" \n\nThank you,\n\n BuyAnyCoin Team"
