Meteor.publish 'attachments', ->
  Attachments.find
    $query: { 'metadata.owner': @userId }
