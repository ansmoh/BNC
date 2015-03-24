accountStatus = new SimpleSchema({
  userId: {
    type: String,
    optional:true
  },
  email: {
    type: String,
    optional:true
  },
  active: {
    type: Boolean,
    defaultValue: true
  }
});

AccountStatus = new Mongo.Collection('accountStatus');
AccountStatus.attachSchema(accountStatus);
