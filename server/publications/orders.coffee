
Meteor.publish 'orders', (selector = {}, options = {}) ->
  Orders.find _.extend(selector, userId: @userId), options