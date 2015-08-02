
Template.BuySellModal.helpers({
  haveBalance: function () {
    var balance = 0;
    Transactions.find({user: Meteor.userId(), currency: 'USD'})
      .map(function (transaction) {
        balance += parseFloat(transaction.amount)
      });
    return balance > 0 ? true : false;
  },
  exchangeBalance: function () {
    if (this.currency) {
      return this.currency.balance() * this.currency.price();
    }
  },
  transactions: function () {
    if (this.currency) {
      return Transactions.find(
        {
          user: Meteor.userId(),
          currency: this.currency.code
        },
        {sort: {timestamp: -1}}
      ).fetch();
    }
  },
  isDisabled: function () {
    return Meteor.user().status !== 'complete'?'disabled':'';
  },
  activeClass: function () {
    if (this.currency) {
      return this.currency.active?'on':'busy';
    }
  },
  isInactive: function () {
    if (this.currency) {
      return !this.currency.active?'disabled':'';
    }
  },
  getDesc: function () {
    if (this.currency) {
      return this.currency.desc?this.currency.desc:'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish.';
    }
  }
})

Template.BuySellModal.events({
  'click .no-balance': function (event, tmpl) {
    toastr.success('To do that please make a deposit', 'Information');
    Router.go('/deposit');
  },
  'click #showToast': function(){
    toastr.error("withdraws are coming soon.");
  }
})

Template.BuySellModal.onRendered(function () {
  var self = this,table;

  self.autorun(function () {
    var data = Template.currentData();
    if (data.currency) {
      var currency = data.currency;
      if (!currency.active) {
        toastr.error('Currency '+ currency.code +' is inactive. Please wait until it is activated again or contact support.', 'Currency Inactive');
      }
    }
  });

  self.$('.modal')
    .on('show.bs.modal', function (event) {
      if (table) {
        table.destroy();
      }
      setTimeout(function () {
        if ($('#currencytxns').html() !== undefined) {
          table = $('#currencytxns').DataTable({
            retrieve: true,
            searching: false,
            pageLength: 10,
            lengthChange: false,
            ordering: false
          });
        }
      }, 100);
    })
  ;

});