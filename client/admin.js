AdminConfig = {
  name: "Buy Any Coin",
  nonAdminRedirectRoute: "/",
  adminEmails:['rb@test.com', 'travis@buyanycoin.com'],
  collections: {
    CustomerInfo: {
      icon: "users",
      color: "green",
      omitFields: ['userId'],
      tableColumns:[
        {label: 'User', name: 'userId'},
        {label: 'First Name', name: 'firstName'},
        {label: 'Last Name', name: 'lastName'},
        {label: 'Contact #', name: 'contactNo'},
        {label: 'Status', name: 'status'}
      ]
    },
    WithdrawalRequest:{
      icon: "sign-out",
      color: "purple",
      omitFields: ['user', 'timestamp'],
      tableColumns:[
        {label: 'Currency', name: 'currency'},
        {label: 'Amount', name: 'amount'},
        {label: 'Status', name: 'status'},
        {label: 'Time', name: 'timestamp'}
      ]
    },
    Transactions:{
      icon: "exchange",
      color: "yellow",
      omitFields: ['timestamp'],
      tableColumns:[
        {label: 'User', name: 'user'},
        {label: 'Currency', name: 'currency'},
        {label: 'Amount', name: 'amount'},
        {label: 'Type', name: 'note'},
        {label: 'Status', name: 'status'},
        {label: 'Time', name: 'timestamp'}
      ]
    },
    Voucher:{
      icon: "credit-card",
      color: "orange",
      tableColumns:[
        {label: 'Code', name: 'code'},
        {label: 'Amount', name: 'amount'},
        {label: 'Currency', name: 'currency'},
        {label: 'Activated', name: 'activated'},
        {label: 'Redeemed', name: 'redeemed'}
      ]
    }
  }
};
