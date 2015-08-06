
Template.navbar.helpers({
  totalBalance: function () {
    var totalBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: 'USD'})
      .map(function(transaction) {
        totalBalance += parseFloat(transaction.amount)
      });
    return totalBalance;
  }
})

Template.navbar.events({
  'click button.toggle': function (e, t) {
    $('.app-aside')
      .toggleClass('off-screen');
    $(event.target)
      .toggleClass('dk');
  }
});