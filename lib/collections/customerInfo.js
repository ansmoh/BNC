customer = new SimpleSchema({
  userId: {
    type: String,
    optional: true,  //Just for admin area as we dont want to edit this
    autoValue: function () {
      if (this.isInsert) {
        return Meteor.userId()
      }
    }
  },
  firstName: {
    type: String,
    label: "First Name",
    regEx: /^[a-zA-Z]{2,25}$/,
    optional:true
  },
  middleName: {
    type: String,
    label: "Middle Name",
    optional:true
  },
  lastName: {
    type: String,
    label: "Last Name",
    regEx: /^[a-zA-Z]{2,25}$/,
    optional:true
  },
  nickName: {
    type: String,
    label: "Name",
    regEx: /^[a-zA-Z]{2,25}$/,
    min: 2,
    optional: true
  },
  contactNo: {
    type: String,
    label: "Phone Number",
    min: 10,
    max: 12,
    autoform: {
      afFieldInput: {
        maskphone:''
      }
    }
  },
  status: {
    type: String,
    defaultValue: 'pending',
    allowedValues: ['pending', 'processing', 'complete']
  },
  synapsepay:{
    type: Object,
    optional: true,
    blackbox: true
  },
  notifUpdate: {
    type: Boolean,
    label: "Notifications for News/Updates",
    defaultValue: true
  },
  notifPromotion: {
    type: Boolean,
    label: "Notifications for Promotions",
    defaultValue: true
  }
});

CustomerInfo = new Mongo.Collection('customerInfo');
CustomerInfo.attachSchema(customer);

Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("images", {})
  ],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

Images.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  },
  download: function(userId) {
    return true;
  }
});
