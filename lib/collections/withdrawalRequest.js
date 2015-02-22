request = new SimpleSchema({
  user: {
    type:String,
    optional: true  //Just for admin area as we dont want to edit this
  },
  amount: {
    type: String
  },
  currency: {
    type: String
  }, 
  destination: {
    type: String
  },
  status: {
    type: String
  },
  timestamp: {
    type: Date,
    label: 'Date-Time',
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  }
});

WithdrawalRequest = new Mongo.Collection('withdrawalRequest');
WithdrawalRequest.attachSchema(request);
