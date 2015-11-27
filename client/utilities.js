// Uitilities

var trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

var isValidPassword = function(val) {
  if (val.length >= 6) {
    return true;
  } else {
    toastr.error("Too short password.", 'Password error');
    return false; 
  }
}

totalDepositFn = function(){
	var totalDeposit = 0;
    var lastTimeStamp = 0;
    Transactions.find({user: Meteor.userId(), currency: "USD", status: 'complete'}).map(function(transaction) {
      if (parseFloat(transaction.amount) > 0) {
        totalDeposit += parseFloat(transaction.amount);
        if (lastTimeStamp == 0 || lastTimeStamp > transaction.timestamp) {
          lastTimeStamp = transaction.timestamp;
        };
      };
    });
    totalDeposit = totalDeposit.toFixed(2);
    Session.set('depositVerified', false);
    Session.set('lastTimeStamp', lastTimeStamp);
    if (totalDeposit >= 5000) {
      Session.set('depositVerified', true);
    };
    return totalDeposit;
}

totalDepositInUSD = function () {
  var total = 0;
  //Transactions.find({user: Meteor.userId()});
  return total;
}