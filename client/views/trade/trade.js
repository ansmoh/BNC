

Template.Trade.helpers({
  currencies: function () {
    // return Currencies.find().fetch();
    var currs = [];
    var _i = 0;
    Currencies.find({}, {sort: {active: -1, sortOrder: 1}}).forEach(function(c) {
      c.position = _i;
      _i++;
      currs.push(c);
    });
    return currs;
  },
  selectedCurrency: function () {
    return Currencies.findOne(TemplateVar.get('currencyId'));
  }
});

Template.Trade.events({
  'click a.panel-heading': function (event, tmpl) {
    TemplateVar.set(tmpl, 'currencyId', this._id);
  }
})

Template.CoinBlock.helpers({
  isNewRow: function () {
    return ((this.position+1) % 4 == 0)
  },
  activeClass: function () {
    return this.active ? 'on' : 'busy'
  },
  roundedRate: function () {
     // var rt = (this.rate).toPrecision(5);
     // return parseFloat(rt).toString();
    if (this.code == "USD") {
      return parseFloat(Math.round(this.rate * 100) / 100).toFixed(2);
    };
    return parseFloat(Math.round(this.rate * 1000000) / 1000000).toFixed(6);
  }
});


Template.TransactionDetail.helpers({
  colorClass: function () {
    return (this.amount > 0)? 'success': 'danger';
  },
  datetime: function () {
    var date = new Date(this.timestamp);
    var options = {
      weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    return date.toLocaleTimeString("en-us", options)
  }
});

Template.TransactionHistory.rendered = function () {
  setTimeout(function () {
    $('#transactions').DataTable({
      searching: false,
      pageLength: 20,
      lengthChange: false,
      ordering: false
    });
  }, 100);
}

Template.TransactionHistory.helpers({
  alltransactions: function () {
    var Txns = [], _i = 1;
    Transactions.find({}, {sort: {timestamp: -1}}).forEach(function (t){
      t.pos = _i++; Txns.push(t);
    });    
    return Txns;
  }
});

Template.TransactionHistoryDetail.rendered = function () {
  $('.label').tooltip();
}

Template.TransactionHistoryDetail.helpers({
  colorClass: function () {
    return (this.amount > 0)? 'success': 'danger';
  },
  labelColorClass: function () {
    return (this.currency == "USD" && this.status == "complete")? 'success': 'warning';
  },
  statusText: function () {
    return (this.currency != "USD")? 'pending': this.status;
  },
  title: function () {
    return (this.currency == "USD" && this.status == "complete")? 'Completed': 'Your transaction is pending and will be completed as soon as possible'
  },
  datetime: function () {
    var date = new Date(this.timestamp);
    var options = {
      weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    return date.toLocaleTimeString("en-us", options)
  }
});
