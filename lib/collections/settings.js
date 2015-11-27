settings_schema = new SimpleSchema({
  desc: {
    type: String,
    optional: true
  },
  active: {
    type: Boolean,
    defaultValue: false
  }
});
Settings = new Mongo.Collection('settings');
Settings.attachSchema(settings_schema);