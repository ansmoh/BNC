User = new Mongo.Collection('user');
userSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true  //Just for admin area as we dont want to edit this
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
    optional: true,
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
    optional: true,
    defaultValue: 'pending',
    allowedValues: ['pending', 'processing', 'complete']
  },
  blockscore:{
    type: Object,
    optional: true,
    blackbox: true
  },
  notifUpdate: {
    type: Boolean,
    optional: true,
    label: "Notifications for News/Updates",
    defaultValue: true
  },
  notifPromotion: {
    type: Boolean,
    label: "Notifications for Promotions",
    defaultValue: true,
    optional: true
  },
  email: {
  	type: String,
  	optional: true
  },
  active: {
  	type: String,
  	optional: true
  },
  loginInfo: {
  	type: [Object],
  	optional: true,
  	blackbox: true
  },
  redeem_info: {
    type: [String],
    optional: true,
    blackbox: true
  },
});

User.attachSchema(userSchema);