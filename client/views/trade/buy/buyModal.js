
Template.buyModal.helpers({
  total: function () {
    if (this.currency && this.currency.rate && TemplateVar.get('buyCoins')) {
      if (TemplateVar.get('buyOption')) {
        return parseFloat(TemplateVar.get('buyCoins') * (this.currency.rate * 1.01));
      } else {
        return parseFloat(TemplateVar.get('buyCoins') / (this.currency.rate * 1.01));
      }
    }
  },
  fee: function () {
    if (this.currency && this.currency.rate && TemplateVar.get('buyCoins')) {
      if (TemplateVar.get('buyOption')) {
        return parseFloat(TemplateVar.get('buyCoins') * this.currency.rate * 0.01);
      } else {
        return parseFloat(TemplateVar.get('buyCoins') * 0.01);
      }
    }
  },
  balance: function () {
    var totalBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: 'USD'})
      .map(function(transaction) {
        totalBalance += parseFloat(transaction.amount)
      });
    totalBalance = parseFloat(totalBalance).toFixed(2);
    TemplateVar.set('balance', totalBalance);
    return totalBalance;
  },
  isBuyOption: function () {
    return TemplateVar.get('buyOption');
  }
});

Template.buyModal.events({
  'click .btn.buy': function (event, tmpl) {
    var amount = TemplateVar.get(tmpl, 'buyCoins'),
        currency = tmpl.data.currency.code;
    if (!TemplateVar.get('buyOption')) {
      amount = amount / tmpl.data.currency.rate;
    }
    Meteor.call('orders/place/buy', currency, amount, function (err, result) {
      if (err) {
        console.log(err);
        toastr.error(err.reason);
      } else {
        tmpl.$('.amount').val('');
        $('#buyModal').modal('hide');
        toastr.success("Purchase successful! Your coins will be available momentarily.");
      }
    });
  },
  'click .btn.buy-max': function (event, tmpl) {
    var currency = tmpl.data.currency;
    if (TemplateVar.get('buyOption')) {
      var coins = TemplateVar.get(tmpl, 'balance') / (currency.rate * 1.01);
      var res = parseFloat(coins).toFixed(2);
      var fee = res * currency.rate * 0.01;
      var with_fee = (coins * currency.rate) + fee;
      if ( with_fee > TemplateVar.get(tmpl, 'balance')) {
        res = res - 1;
      }
      tmpl.$('.amount').val(res);
    } else {
      tmpl.$('.amount').val(TemplateVar.get(tmpl, 'balance'));
    }
    TemplateVar.set(tmpl, 'buyCoins', tmpl.$('.amount').val());
  },
  'propertychange .amount, change .amount, click .amount, keyup .amount, input .amount, paste .amount': function (event, tmpl) {
    var input = $(event.target);
    TemplateVar.set(tmpl, 'buyCoins', input.val() > 0?input.val():0);
  },
  'change .options :radio': function (event, tmpl) {
    TemplateVar.set(tmpl, 'buyOption', $(event.target).val() === 'USD'?false:true);
  }
});

Template.buyModal.onRendered(function() {
  var self = this;

  self.$('.modal')
    .on('show.bs.modal', function (event) {
      var modal = $(event.target);

      modal.find('.amount').val('');

      TemplateVar.set(self, 'buyOption', true);
      TemplateVar.set(self, 'buyCoins', '');
    });
});