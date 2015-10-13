
###
* Hook: Check if a User is Logged In
* If a user is not logged in and attempts to go to an authenticated route,
* re-route them to the login screen.
###

checkUserLoggedIn = ->
  if !Meteor.loggingIn() and !Meteor.user()
    Router.go 'home'
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

Router.onBeforeAction userAuthenticated, only: [
  'home'
]