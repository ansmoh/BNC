
Template.withdrawModal.helpers({

});

Template.withdrawModal.events({
  'click .btn.withdraw': function (event, tmpl) {
    var count = parseFloat(tmpl.$('.amount').val());
    var address = tmpl.$('.address').val();

    Meteor.call('coins/withdraw', tmpl.data.currency.code, count, address, function (err, result) {
      if (err) {
        console.log(err);
        toastr.error(err.reason);
      } else {
        toastr.success('Withdraw request submitted!');
        $('#withdrawModal').modal('hide');
      }
      console.log(err);
    });
  }
});

Template.withdrawModal.onRendered(function () {
  var self = this;

  self.$('.modal')
    .on('show.bs.modal', function (event) {
      var modal = $(event.target);

    })
  ;
});