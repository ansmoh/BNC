
Template.registerHelper 'absoluteUrl', (path = null, options = {}) ->
  Meteor.absoluteUrl(path, options)