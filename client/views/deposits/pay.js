Template.Pay.created = function () {
  //function to load a given js file
  var fileRef;
  fileRef = document.createElement('script');
  fileRef.setAttribute('id', "knox_payments_script");
  fileRef.setAttribute("button_text","PAY USING KNOX PAYMENTS");
  fileRef.setAttribute("api-key","775a518965876a2b68b9ae1de6ff8fc9ed543a92");
  fileRef.setAttribute("recurring","ot");
  fileRef.setAttribute("user_request","show_all");
  fileRef.setAttribute("response_url","/");
  fileRef.setAttribute("invoice_detail","To buy coins from www.buyanycoin.com");
  fileRef.setAttribute("src", "https://knoxpayments.com/merchant/knox.js");

  if (typeof fileRef !== "undefined") {
    document.getElementsByTagName("head")[0].appendChild(fileRef);
  }
}

var Utils = {
  parseUrl: function () {
    var parser = document.createElement('a'),
      searchObject = {},
      queries, split, i;
    // Let the browser do the work
    parser.href = window.location.href;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
      split = queries[i].split('=');
      searchObject[split[0]] = split[1];
    }
    return searchObject
  }
}


Template.Pay.helpers({
  postPayment: function () {
    return (undefined !== Utils.parseUrl().completed) ? true : false
  },
  payID: function () {
    return Utils.parseUrl().pay_id
  },
  status: function () {
    return Session.get('depositStatus')
  },
})


// Run if we see parameters in the url in url
if (undefined !== Utils.parseUrl().completed){
  Session.set('depositStatus', 'Processing transaction.....')
  var payID = Utils.parseUrl().pay_id
  // HTTP call to knoxpayments to get the transaction_details according to the txnID
  Meteor.call("transactionDetails", payID, function(error, results) {
    var paymentDetails = results.data.GetPaymentDetails;
    var amount = parseFloat(results.data.GetPaymentDetails.payment_amount)
    if (error) {
      alert(error)
    }
    else {
      console.log(paymentDetails)
      if(paymentDetails.error_code !== 'null' || !paymentDetails.error_code) {
        alert('Error code: '+paymentDetails.error_code);
        Session.set('depositStatus', 'Error!')
      }
      else {
        Meteor.call('depositViaKnox', 'USD', amount, payID, function (error, result) {
          if (error) {
            alert(error);
            Session.set('depositStatus', 'Error')
          }
          else {
            Session.set('depositStatus', amount+' has been successfully deposited to your account!')
          }
        });
      }
    }
  });
}
return ''
