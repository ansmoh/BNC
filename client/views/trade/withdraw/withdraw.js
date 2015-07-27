Template.WithdrawModal.rendered = function () {
  $('#withdrawModal').on('show.bs.modal', function (event) {
    //console.log(3, 'shown');
    //var button = $(event.relatedTarget); // Button that triggered the modal
    //var currency = Session.get('modalCurrency'); // Extract info from data-* attributes
    //var modal = $(this);
    //modal.find('.modal-title').text('Withdrawal request for ' + currency);
  });
}

Template.WithdrawModal.events({
  'click .withdraw':function () {
    var count = parseFloat($('#withdrawModal #coinCount').val());
    var wAdd = $('#withdrawModal #wAddress').val();
    if( !wAdd || wAdd === " " || wAdd.length < 4){
      toastr.error("Destination address is required and should be min 4 characters.");
      return;
    }
    if( !isPositiveInteger(count) || Session.get("coinsBalance") < count ){
      toastr.error("Please check the withdraw amount.");
      return;
    }
    // 1AenJytuP6en22SKWTXWDEh5BqAfd7gXSb
    var url = "https://shapeshift.io/validateAddress/"+wAdd+"/"+Session.get('modalCurrency');
    HTTP.get(url, {}, function(e,r){
      if(e){
        toastr.error("Invalid withdraw address, please check the address and try again");
        return;
      }else{
        if( r.statusCode === 200 &&  r.data.isvalid ){
           Meteor.call('withdrawCoin', Session.get('modalCurrency'), count, wAdd, function (error, result) {
            if (error) {
              alert(error)
            } else {
              toastr.success("withdraw success.")
              console.log(result)
            }
          })
         }else{
            toastr.error("Invalid withdraw address, please check the address and try again");
            return;
         }
         $('#withdrawModal').modal('hide');
      }
    });
   
    
  },
  'click .withdrawAll': function(){
    $('#withdrawModal #coinCount').val( Session.get('modelBalance') )
  }
})