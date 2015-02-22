Template.SideBar.events({
  'click .off-screen a': function (e, t) {
    $("div.off-screen").removeClass("off-screen");
    $(".side-nav").removeClass('dk');
  },
  'click .signout':function (e) {
    Meteor.logout()
  }
});
