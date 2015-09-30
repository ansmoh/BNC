# BuyAnyCoin Web App

#FACTS:
The app is connected to multiple external data sources like cryptsy.com, coinbase.com, shapshift.io and our database.
We take a design approach as less is more especially when crypto can already be overwhelming.

#Overview:

compose.io houses mongodb

modulus.io runs the live app

4 api's used; knoxpayments, cryptsy, coinbase, shapeshift

  knoxpayment - ACH deposits and withdrawls
  
  cryptsy - exchange
  

  coinbase - stable bitcoin price
  
  shapeshift - verifiy withdrawl address for coin so users can't fuck themselves.
  


#Launching:

To Launch the webapp locally, navigate to the location of the code after unzipping it in any CLI. 

Use the command "meteor --settings:settings.json" to run the webapp locally with full functionality.
