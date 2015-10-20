# Changes the viewable colletions in the webapp at app.buyanycoin.com/admin

@AdminConfig =
  name: 'BuyAnyCoin'
  nonAdminRedirectRoute: '/'
  adminEmails: ['buyanycoin@gmail.com','anshuman.ewest@gmail.com','thor@buyanycoin.com']
  collections:
    Coins:
      icon: 'usd'
    Currencies:
      icon: 'usd'
      tableColumns: [
        {
          label: 'Currency Code'
          name: 'code'
        }
        {
          label: 'Name'
          name: 'name'
        }
        {
          label: 'Price(in USD)'
          name: 'rate'
        }
        {
          label: 'Price(in BTC)'
          name: 'btcRate'
        }
        {
          label: 'Status'
          name: 'active'
        }
      ]
    WithdrawalRequest:
      icon: 'sign-out'
      color: 'purple'
      omitFields: [
        'user'
        'timestamp'
      ]
      tableColumns: [
        {
          label: 'UserId'
          name: 'user'
        }
        {
          label: 'Currency'
          name: 'currency'
        }
        {
          label: 'Amount'
          name: 'amount'
        }
        {
          label: 'Status'
          name: 'status'
        }
        {
          label: 'Time'
          name: 'timestamp'
        }
      ]
    Transactions:
      icon: 'exchange'
      color: 'yellow'
      omitFields: [ 'timestamp' ]
      tableColumns: [
        {
          label: 'User'
          name: 'user'
        }
        {
          label: 'Currency'
          name: 'currency'
        }
        {
          label: 'Amount'
          name: 'amount'
        }
        {
          label: 'Type'
          name: 'note'
        }
        {
          label: 'Status'
          name: 'status'
        }
        {
          label: 'Time'
          name: 'timestamp'
        }
      ]
    Voucher:
      icon: 'credit-card'
      color: 'orange'
      tableColumns: [
        {
          label: 'Code'
          name: 'code'
        }
        {
          label: 'Amount'
          name: 'amount'
        }
        {
          label: 'Currency'
          name: 'currency'
        }
        {
          label: 'Activated'
          name: 'activated'
        }
        {
          label: 'Redeemed'
          name: 'redeemed'
        }
      ]
