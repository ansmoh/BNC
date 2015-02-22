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
    optional:true
  },
  middleName: {
    type: String,
    optional:true
  },
  lastName: {
    type: String,
    optional:true
  },
  contactNo: {
    type: String,
    autoform: {
      afFieldInput: {
        maskphone:''
      }
    }
  },
  govtId: {
    type: String,
    optional:true,
    label: 'ID Proof (Govt.)',
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images'
      }
    }
  },
  profilePic: {
    type: String,
    optional:true,
    label: 'Profile Picture',
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images'
      }
    }
  },
  addressProof: {
    type: String,
    optional:true,
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images'
      }
    }
  },
  status: {
    type: String,
    defaultValue: 'pending'
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
