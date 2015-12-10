Router.route('/synapse/hook', { where: 'server' })
  .post ->
    request = this.request
    response = this.response
    doc = request.body
    # console.log request.headers['x-synapse-signature']
    sp = new InitSynapsePay('127.0.0.1', '134124124')
    # console.log sp.sp.client.Client.createHMAC(request.body)
    if request.headers['x-synapse-signature'] == sp.sp.client.Client.createHMAC(doc)
      SynapseTransactions.update({ synapseId: doc._id['$oid'] }, $set: {status: doc.recent_status.status})
      if doc.recent_status.status == "SETTLE"
        SynapseTransactions.settle(doc._id['$oid'])
      this.response.end('OK');
    else
      this.response.end('HMAC error');
