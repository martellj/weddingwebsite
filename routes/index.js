var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun(process.env.MAILGUN_API_KEY);

function sendMail(recip, obj) {
  mg.sendText('john@johnmartell.net',
      [recip],
      "Thanks for your RSVP",
      "<html><body><h3>Thanks for your RSVP!</h3><div><b>Name:</b> " + obj.name + "</div><div><b>Email:</b> " + obj.email + "</div><div><b>Attending:</b> " + obj.attending + "</div><div><b>Dinner Option:</b> " + obj.dinnerOption +"</div></body></html>",
      {"Content-Type" : "text/html"},
      function(err) {
        err && console.log(err)
      });
}


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

  sendMail("jnmartell2007@gmail.com",mongoObject);
  sendMail(mongoObject.email,mongoObject);

  MongoClient.connect(url, function(err, db) {
    db.collection('rsvp').insertOne(mongoObject);
    db.close();
  });
  res.send(200);
});



module.exports = router;
