
Template.defaultLayout.helpers({
  hasAlert: function () {
    var res = Settings.findOne();
    if( res ){
      return res.active;
    }
  },
  alerttext: function () {
    var res = Settings.findOne();
    if( res ){
      return res.desc;
    }
  },
});

Template.defaultLayout.onRendered(function () {

});

