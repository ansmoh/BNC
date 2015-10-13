
Template.coins.onCreated(function () {

});

Template.coins.helpers({
  coins: function () {
    return Coins.find({},{sort:{order:1}});
  },
  selectedCoin: function () {
    return Coins.findOne(TemplateVar.get('coinId'));
  },
  activeClass: function () {
    return this.maintenance ? 'busy' : 'on';
  },
});

Template.coins.events({
  'click a.panel-heading': function (event, tmpl) {
    TemplateVar.set(tmpl, 'coinId', this._id);
  }
});

Template.coins.onRendered(function(){

});

Template.coins.onDestroyed(function () {

});