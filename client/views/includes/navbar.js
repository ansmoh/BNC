Template.Navbar.events({
  'click button.toggle': function (e, t) {
    $( '.app-aside' ).toggleClass('off-screen');
    button.toggleClass('dk');
  }
});

Template.Navbar.helpers({
  loggedIn:function () {
    return Meteor.userId()
  }
});
