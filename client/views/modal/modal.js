Template.body.events({
  'click button.modal': function(event, template) {
    var name = template.$(event.target).data('modal-template');
    Session.set('activeModal', name);
  }
});

Template.modal.helpers({
  activeModal: function() {
    return Session.get('activeModal');
  }
});
