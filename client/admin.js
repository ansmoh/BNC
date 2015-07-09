AdminConfig = {
  name: "BuyAnyCoin",
  nonAdminRedirectRoute: "/",
  adminEmails:['buyanycoin@gmail.com', 'thor@buyanycoin.com'],
  collections: {
    Currencies: {
      icon: "usd",
      tableColumns:[
        {label: 'Currency Code', name: 'code'},
        {label: 'Name', name: 'name'},
        {label: 'Price(in USD)', name: 'rate'},
        {label: 'Price(in BTC)', name: 'btcRate'},
        {label: 'Status', name: 'active'}
      ]
    },
    CustomerInfo: {
      icon: "info-circle",
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
    AccountStatus: {
      icon: "exclamation-triangle",
      color: "red",
      omitFields: ['userId'],
      tableColumns:[
        {label: 'User', name: 'userId'},
        {label: 'Email', name: 'email'}
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
    },
    Settings:{
      icon: "cog",
      color: "red",
      tableColumns:[
        {label: 'Desc', name: 'desc'},
        {label: 'Active', name: 'active'}
      ]
    }
  }
};
