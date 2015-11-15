this.synapse = {
  client: null,

  init: function() {
    var SynapsePayClient = require('synapse_pay_rest');

    var headers = {
        'fingerprint' : "USER_FINGERPRINT",
        'client_id' :  Meteor.settings.synapse.id,
        'client_secret' :  Meteor.settings.synapse.secret,
        'ip_address' :  '0.0.0.0',
        'development_mode' :  true
    };

    user_id = SynapseUsers.findOne({})._id
    this.client = SynapsePayClient(headers,user_id);
  },

  createWebsiteUser: function() {
    this.init()
    //first synapse user will be site
    if(SynapseUsers.find({}).count()==0) {
      var create_payload = {
          "logins" :  [
              { "email" :  "app@bnc.com"  }
          ],
          "phone_numbers" :  [
              "901.111.1111"
          ],
          "legal_names" : [ "BNC ADMIN" ]
      };

      this.client.Users.create(create_payload, Meteor.bindEnvironment(function(response) {
        synapse.response = response;
        SynapseUsers.insert(response)
      }));
    }
  },

  //before creating account for example
  authorizeWebsite: function() {
    var oauth_payload = {
        "refresh_token" :  SynapseUsers.findOne({}).refresh_token
    };

    var oauth_response = this.client.Users.refresh(oauth_payload, Meteor.bindEnvironment(function(response) {
      synapse.response = response
    }));
  },

  createWebsiteAccount: function() {
    //first account will be site account
    if(SynapseAccounts.find({}).count()==0) {
      var login_payload = {
        "type" : "ACH-US",
        "info" : {
            "bank_id" : "synapse_nomfa",
            "bank_pw" : "test1234",
            "bank_name" : "fake"
        }
      };

      var login_response = this.client.Nodes.add(login_payload, Meteor.bindEnvironment(function(response) {
        synapse.response = response;
        if(!response.error) {
          SynapseAccounts.insert(response)
        }
      }));

    }

  },

  createUser: function(email,legal_name, then) {
    var create_payload = {
        "logins" :  [
            { "email" :  email  }
        ],
        "phone_numbers" :  [
            "901.111.1111"
        ],
        "legal_names" : [ legal_name ]
    };

    this.client.Users.create(create_payload, Meteor.bindEnvironment(function(response) {
      synapse.response = response;
      var synapse_user = SynapseUsers.insert(response)
      then && then(synapse_user)
    }));
  },

  authorizeUser: function(synapse_user_id,then) {
    var oauth_payload = {
        "refresh_token" :  SynapseUsers.findOne({_id:synapse_user_id}).refresh_token
    };

    console.log("AUTHORIZING USER")
    var oauth_response = this.client.Users.refresh(oauth_payload, Meteor.bindEnvironment(function(response) {
      console.log(response)
      synapse.response = response
      then && then(response)
    }));


  },

  //user should be authorized before
  createAccount: function(bank_name,bank_id,bank_password, then) {
      var login_payload = {
        "type" : "ACH-US",
        "info" : {
            "bank_id" : bank_id,
            "bank_pw" : bank_password,
            "bank_name" : bank_name
        }
      };

      console.log("CREATING ACCOUNT")
      var login_response = synapse.client.Nodes.add(login_payload, Meteor.bindEnvironment(function(response) {
        console.log(response)
        synapse.response = response;
        if(!response.error) {
          var synapse_account_id = SynapseAccounts.insert(response)
          then && then(synapse_account_id)
        }
      }));

  },

  depositFunds: function(from_node_id, amount, then) {

    //depositing to website account
    var trans_payload = {
        "to" : {
            "type" : "ACH-US",
            "id" : SynapseAccounts.findOne().nodes[0]._id
        },
        "amount" : {
            "amount" : amount,
            "currency" : "USD"
        },
        "extra" : {
               "note" : "Deposit to bnc site",
               "webhook" : "http://requestb.in/ocvk65oc",
               "process_on" : 1,
               "ip" : "192.168.0.1"
        },
    };

    console.log("CREATING TRANSACTION")
    var create_response = synapse.client.Trans.create(from_node_id, trans_payload, Meteor.bindEnvironment(function(response) {
      console.log(response)
      synapse.response = response
      if(!response.error) {
        then && then(response)
      }
    }));

  },

  createDepositTransaction: function(meteor_user_id,amount) {
      var t_data = {
          user: meteor_user_id,
          currency: "USD",
          amount: amount,
          note: "synapsepay deposit",
          status: 'complete',
          timestamp: Date()
        };
      return Transactions.insert( t_data );
  }



}


Meteor.methods({
  synapseDeposit: function(doc) {
    synapse.init()
    synapse.createUser(Meteor.user().emails[0],"BNC user", function(synapse_user_id) {

      synapse.authorizeUser(synapse_user_id, function() {

        synapse.createAccount(doc.bank_name, doc.bank_id, doc.bank_pw, function(synapse_account_id) {
          var account = SynapseAccounts.findOne({_id:synapse_account_id})

          synapse.depositFunds(account.nodes[0]._id, doc.amount, function() {
            synapse.createDepositTransaction(Meteor.user()._id,doc.amount)
            console.log("DEPOSIT FINISHED")
          })
        })
      })
    })
  }
})
