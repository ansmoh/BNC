
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
