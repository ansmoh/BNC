
Template.sellModal.helpers({
  rate: function () {
    if (this.currency) {
      return this.currency.rate * (1 - Meteor.settings.public.feeSell);
    }
  },
  balance: function () {
    var balance = 0;
    if (this.currency) {
      Transactions.find({currency: this.currency.code})
        .map(function (transaction) {
          balance += parseFloat(transaction.amount)
        })
      TemplateVar.set('coinsBalance', balance);
      return balance;
    }
  },
  total: function () {
    if (this.currency) {
      return (TemplateVar.get('sellCoins') || 0) * this.currency.rate * (1 - Meteor.settings.public.feeSell);
    }
  },
  fee: function () {
    if (this.currency) {
      return (TemplateVar.get('sellCoins') || 0) * this.currency.rate * Meteor.settings.public.feeSell;
    }
  },
});

Template.sellModal.events({
  'click .btn.sell': function (event, tmpl) {
    var volume = TemplateVar.get(tmpl, 'sellCoins'),
        symbol = tmpl.data.currency.code;

    Meteor.call('orders/place/sell', symbol, volume, function (err, result) {
      if (err) {
        console.log(err);
        toastr.error(err.reason);
      } else {
        tmpl.$('.amount').val('');
        $('#sellModal').modal('hide');
        toastr.success("Purchase successful! Your coins will be available momentarily.");
      }
    });
  },
  'propertychange .amount, change .amount, click .amount, keyup .amount, input .amount, paste .amount': function (event, tmpl) {
    var input = $(event.target);
    TemplateVar.set(tmpl, 'sellCoins', input.val() > 0?input.val():0);
  },
  'click .btn.sell-all': function (event, tmpl) {
    TemplateVar.set(tmpl, 'sellCoins', TemplateVar.get(tmpl, 'coinsBalance'));
    tmpl.$('.amount').val(TemplateVar.get(tmpl, 'coinsBalance'));
  }
});

Template.sellModal.onRendered(function () {
  var self = this;

  self.$('.modal')
    .on('show.bs.modal', function (event) {
      var modal = $(event.target);

      modal.find('.coins').val('');

      //TemplateVar.set(self, 'buyOption', true);
      TemplateVar.set(self, 'sellCoins', '');
    });
});