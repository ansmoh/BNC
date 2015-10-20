
###
* Hook: Check if a User is Logged In
* If a user is not logged in and attempts to go to an authenticated route,
* re-route them to the login screen.
###

checkUserLoggedIn = ->
  unless Meteor.loggingIn()
    unless Meteor.user()
      Router.go 'home'
    else
      @next()
  else
    @next()

###
# Tier 1 should be part of the initial sign up process right after email verification,
# if they don't complete this portion they should not have access to the webapp
###
checkUserVerification = ->
  unless Meteor.loggingIn()
    if Meteor.user().statusTierOne() isnt 'complete'
      Router.go 'verification'
    else
      @next()
  else
    @next()

###
* Hook: Check if a User Exists
* If a user is logged in and attempts to go to a public route, re-route
* them to the index path.
###

userAuthenticated = ->
  if !Meteor.loggingIn() and Meteor.user()
    Router.go 'trade'
  else
    @next()

Router.onBeforeAction checkUserLoggedIn, except: [
  'home'
]

Router.onBeforeAction checkUserVerification, except: [
  'home'
  'verification'
]

Router.onBeforeAction userAuthenticated, only: [
  'home'
]