AdminConfig = {
  adminEmails:['thor@buyanycoin.com', 'buyanycoin@gmail.com'],
  collections: {
    Currencies: {},
    Settings:{},
    CustomerInfo: {},
    WithdrawalRequest:{},
    Transactions:{},
    AccountStatus:{},
    Voucher:{}
  },
  userSchema: new SimpleSchema({
    'frstname': {
       type: String,
       autoValue: function(){
        console.log(this.userId);
       }
     }
  })
};
