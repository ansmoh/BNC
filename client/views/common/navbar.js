
Template.navbar.events({
  'click button.toggle': function (e, t) {
    $('.app-aside')
      .toggleClass('off-screen');
    $(event.target)
      .toggleClass('dk');
  }
});