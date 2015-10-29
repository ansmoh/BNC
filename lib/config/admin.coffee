# Changes the viewable colletions in the webapp at app.buyanycoin.com/admin

@AdminConfig =
  name: 'BuyAnyCoin'
  nonAdminRedirectRoute: '/'
  adminEmails: ['buyanycoin@gmail.com','anshuman.ewest@gmail.com','thor@buyanycoin.com']
  collections:
    Coupons:
      icon: 'credit-card'
      color: 'orange'
    Currencies:
      icon: 'usd'
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
    Orders:
      icon: 'exchange'
      color: 'yellow'
    Vouchers:
      icon: 'credit-card'
      color: 'orange'
    User:
      icon: 'users'
      color: 'blue'
      extraFields: ['balance']
      ###
      routes:
        view:
          waitOn: ->
            [
              Meteor.subscribe 'currencies'
            ]
      ###
      tableColumns: [
        {label: 'ID', name: '_id'}
        {label: 'Email', name: 'emails[0].address'}
        {label: 'Total Balance', name: 'totalBalance()'}
      ]
