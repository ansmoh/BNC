transaction = new SimpleSchema({
  user: {
    type:String,
    optional: true  //Just for admin area as we dont want to edit this
  },
  currency: {
    type: String
  },
  amount: {
    type: String
  },
  note: {
    type: String
  },
  txnid: {
    type: String,
    optional: true
  },
  status: {
    type: String,
    defaultValue: 'pending',
    allowedValues: ['pending', 'complete']
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

Transactions = new Mongo.Collection('transactions');
Transactions.attachSchema(transaction);
