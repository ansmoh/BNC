
Template.buyModal.helpers({
  price: function () {
    if (this.currency) {
      if (TemplateVar.get('secondaryCode') === 'USD') {
        return this.currency.rate;
      } else {
        return this.currency.btcRate;
      }
    }
  },
  subTotal: function () {
    if (this.currency && TemplateVar.get('amount')) {
      var rate = this.currency.rate;
      if (TemplateVar.get('secondaryCode') === 'USD') {
        return TemplateVar.get('amount') * this.currency.rate;
      } else {
        return TemplateVar.get('amount') * this.currency.btcRate;
      }
    }
  },
  total: function () {
    if (this.currency && TemplateVar.get('amount')) {
      if (TemplateVar.get('secondaryCode') === 'USD') {
        return TemplateVar.get('amount') * this.currency.rate * (1 + this.currency.buyFee());
      } else {
        return TemplateVar.get('amount') * this.currency.btcRate * (1 + this.currency.buyFee());
      }
    }
  },
  fee: function () {
    if (this.currency && TemplateVar.get('amount')) {
      var rate = this.currency.rate;
      if (TemplateVar.get('secondaryCode') === 'USD') {
        return TemplateVar.get('amount') * this.currency.rate * this.currency.buyFee();
      } else {
        return TemplateVar.get('amount') * this.currency.btcRate * this.currency.buyFee();
      }
    }
  },
  balance: function () { // OK
    var totalBalance = 0;
    Transactions.find({user: Meteor.userId(), currency: TemplateVar.get('secondaryCode')})
      .map(function(transaction) {
        totalBalance += parseFloat(transaction.amount)
      });
    //totalBalance = parseFloat(totalBalance).toFixed(2);
    TemplateVar.set('balance', totalBalance);
    return totalBalance;
  },
  isBuyOption: function () {
    return TemplateVar.get('buyOption');
  },
  secondaryCode: function () { // OK
    return TemplateVar.get('secondaryCode');
  },
  /*
  type: function () {
    return TemplateVar.get('type');
  }*/
});

Template.buyModal.events({
  'click .btn.buy': function (event, tmpl) {
    var amount = TemplateVar.get(tmpl, 'amount'),
        primaryCode = tmpl.data.currency.code,
        secondaryCode = TemplateVar.get(tmpl, 'secondaryCode'),
        price = secondaryCode === 'USD'?tmpl.data.currency.rate:tmpl.data.currency.btcRate,
        btn = $(event.target);

    btn.closest('.modal-footer').find('button').attr('disabled','disabled');
    btn.button('loading');
    Meteor.call('orders/create', 'buy', primaryCode, secondaryCode, amount, price, function (err, result) {
      btn.closest('.modal-footer').find('button').removeAttr('disabled');
      btn.button('reset');
      if (err) {
        toastr.error(err.reason);
      } else {
        $('#buyModal').modal('hide');
        toastr.success("Purchase successful! Your coins will be available momentarily.");
      }
    });
  },

  /*
  'click .btn.buy': function (event, tmpl) {
    var amount = TemplateVar.get(tmpl, 'buyCoins'),
        currency = tmpl.data.currency.code,
        btn = $(event.target);

    if (!TemplateVar.get('buyOption')) {
      amount = amount / tmpl.data.currency.rate;
    }

    btn.closest('.modal-footer').find('button').attr('disabled','disabled');
    btn.button('loading');
    Meteor.call('orders/place/buy', currency, amount, function (err, result) {
      btn.closest('.modal-footer').find('button').removeAttr('disabled');
      btn.button('reset');
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
  */
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
    var input = $(event.target),
        amount = input.val() > 0 ?input.val():0;

    TemplateVar.set(tmpl, 'amount', amount);
    /*
    if (TemplateVar.get(tmpl, 'type') === 'USD') {
      TemplateVar.set(tmpl, 'amount', amount / tmpl.data.currency.rate);
    } else {
      TemplateVar.set(tmpl, 'amount', amount);
    }*/
  },
  /*
  'click .secondaryCodes > label.btn': function (event, tmpl) {
    var radio = $(event.target).find(':radio');
    //TemplateVar.set(tmpl, 'buyOption', radio.val() === 'USD'?false:true);
    TemplateVar.set(tmpl, 'secondaryCode', radio.val());
  },
  'change select.type': function (event, tmpl) {
    tmpl.$('.amount').val('').focus();
    TemplateVar.set(tmpl, 'amount', '');
    TemplateVar.set(tmpl, 'type', $(event.target).val());
  }*/
});

Template.buyModal.onRendered(function() {
  var self = this;

  self.autorun(function () {
    var data = Template.currentData();
    if (data.currency) {
      if (data.currency.code === 'BTC') {
        TemplateVar.set(self, 'secondaryCode', 'USD');
      } else {
        TemplateVar.set(self, 'secondaryCode', 'BTC');
      }
    }
  });

  self.$('.modal')
    .on('show.bs.modal', function (event) {
      var modal = $(event.target);

      modal.find('.amount').val('');
      //modal.find('.secondaryCodes > label.btn').removeClass('active');
      //modal.find('.secondaryCodes > label.btn:first').addClass('active');
      //modal.find('.secondaryCodes > label.btn:first :radio').attr('checked','checked');
      //modal.find('select.type').val('BTC');

      //TemplateVar.set(self, 'type', 'BTC');
      TemplateVar.set(self, 'amount', '');
      //TemplateVar.set(self, 'buyOption', true);
      //TemplateVar.set(self, 'buyCoins', '');
    })
  ;

});