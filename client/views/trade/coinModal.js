
Template.coinModal.onCreated(function () {

});

Template.coinModal.helpers({
  activeClass: function () {
    if (this.coin) {
      return this.coin.maintenance ? 'busy' : 'on';
    }
  },
});

Template.coinModal.events({

});

Template.coinModal.onRendered(function(){

});

Template.coinModal.onDestroyed(function () {

});