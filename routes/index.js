var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

router.get('/', function(req,res) {
  res.sendfile('public/index.html');
});

router.post('/rsvp', function(req,res) {
  var url = process.env.M_CONNECTION_STRING;

  var json = req.body;
  var mongoObject = {
    name : encodeURIComponent(json.name) || "NOT PROVIDED",
    email : encodeURIComponent(json.email) || "NOT PROVIDED",
    dinnerOption : encodeURIComponent(json.dinnerOption) || "NOT PROVIDED",
    attending : !!json.attending
  };

  MongoClient.connect(url, function(err, db) {
    db.collection('rsvp').insertOne(mongoObject);
    db.close();
  });
  res.send(200);
});



module.exports = router;
