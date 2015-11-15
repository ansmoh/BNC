/* storage for Synapse Users */
SynapseUsers = new Mongo.Collection('synapse_users');

this.synapse_user_second = function() {
  return SynapseUsers.find().fetch()[1]
}
