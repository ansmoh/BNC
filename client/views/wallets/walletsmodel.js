Template.WalletsModal.rendered = function () {
	$('#walletsModal').on('show.bs.modal', function (event) {
		console.log('in', 'shown');
		var button = $(event.relatedTarget); // Button that triggered the modal
		var currency = button.data('currency'); // Extract info from data-* attributes
		Session.set('WalletModelCurrency', currency);
		var rate = button.data('rate'); // Extract info from data-* attributes
		Session.set('WalletModelRate', rate);
		var modal = $(this);
		modal.find('.modal-title').text("Transactions for "+ currency);
	})
}

Template.WalletsModal.helpers({
	currencyBalance: function () {
		var totalBalance = 0;
		Transactions.find({user: Meteor.userId(), currency: Session.get('WalletModelCurrency')}).map(function(transaction) {
			totalBalance += parseFloat(transaction.amount)
		});
		Session.set('WalletModelBalance', totalBalance);
		return totalBalance
	},
	currency: function () {
		return Session.get('WalletModelCurrency');
	},
	exchangeBalance: function () {
		return parseFloat(Session.get('WalletModelBalance'))*parseFloat(Session.get('WalletModelRate'));
	},
	transactions: function () {
		return Transactions.find({user: Meteor.userId(), currency: Session.get('WalletModelCurrency')}).fetch();
	}
});

Template.TransactionDetail.helpers({
	colorClass: function () {
		return (this.amount > 0)? 'success': 'danger';
	}
});