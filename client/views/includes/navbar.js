Template.Navbar.events({
  'click button.toggle': function (e, t) {
    var button = $(e.target); // Button that triggered
    var target = button.data('target');
    var tClass = button.data('toggle');
    $( target ).toggleClass(tClass);
    button.toggleClass('dk');
  }
});

Template.Navbar.helpers({
  loggedIn:function () {
    return Meteor.userId()
  }
});
