var express = require('express')
var app = express()
var http = require('http');
//Shippo shipping wrapper
var Raven = require('raven');
var shippo = require('shippo')('shippo_test_d5b596c818e3b09618124e4c2a4cc0117de9c3d3');
const path = require('path');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));
//Test

app.get('/', function (req, res) {
  res.render('index.html');
})
app.post('/newship/', function (req, res) {

  var addressFrom  = {
      "object_purpose":"PURCHASE",
      "name": "Mr Shippotester",
      "company":"Shippo",
      "street1":"215 Clayton St.",
      "city":"San Francisco",
      "state":"CA",
      "zip":"94117",
      "country":"US", //iso2 country code
      "phone":"+1 555 341 9393",
      "email":"support@goshippo.com",
  };

  // example address_to object dict
  var addressTo = {
      "object_purpose":"PURCHASE",
      "name": req.body.fnames + ' ' + req.body.lnames,
      "company": req.body.company,
      "street1":req.body.street,
      "city":req.body.city,
      "state":req.body.state,
      "zip":req.body.zipcode,
      "country": req.body.country, //iso2 country code
      "phone":"+1 555 341 9393",
      "email":"support@goshippo.com",
  };

  // parcel object dict
  var parcelOne = {
      "length":"5",
      "width":"5",
      "height":"5",
      "distance_unit":"in",
      "weight":"2",
      "mass_unit":"lb"
  };


  var shipment = {
      "object_purpose": "PURCHASE",
      "address_from": addressFrom,
      "address_to": addressTo,
      "parcel": [parcelOne],
      "submission_type": "DROPOFF"
  };

  shippo.transaction.create({
    "shipment": shipment,
    "servicelevel_token": "ups_standard",
    "carrier_account": 'CARRIER_TOKEN',
    "label_file_type": "PDF"
   })
     .then(function(transaction) {
         return shippo.transaction.list({
           "rate": transaction.rate
         })
      })
     .then(function(mpsTransactions) {
       mpsTransactions.results.forEach(function(mpsTransaction){
           if(mpsTransaction.object_status == "SUCCESS") {
               console.log("Label URL: %s", mpsTransaction.label_url);
               console.log("Tracking Number: %s", mpsTransaction.tracking_number);
               console.log("E-Mail: %s", mpsTransaction.object_owner);
               console.log(mpsTransaction.object_status);
               res.status(200).send("Label can be found under: " + mpsTransaction.label_url);
           } else {
               // hanlde error transactions
               console.log("Message: %s", mpsTransactions.messages);
           }
       });
      })
     .catch(function (error) {
       // Deal with an error
       console.log("There was an error creating transaction : %s", err.detail);
       res.send("something happened :O")
     });
    })
app.post('/successp', function (req, res) {

  var token = req.body.stripeToken; // Using Express
  // Charge the user's card:
var charge = stripe.charges.create({
  amount: 1000,
  currency: "eur",
  description: "Example charge",
  source: token,
}, function(err, charge) {
  // asynchronously called
});
 res.send('Thanks!')
})
app.post('/successp', function (req, res) {

  var token = req.body.stripeToken; // Using Express
  // Charge the user's card:
var charge = stripe.charges.create({
  amount: 1000,
  currency: "eur",
  description: "Example charge",
  source: token,
}, function(err, charge) {
  // asynchronously called
});
 res.send('Thanks!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})