var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun(process.env.MAILGUN_API_KEY);

function sendMail(recip, obj) {
     try {
         mg.sendRaw('john@johnmartell.net',
             [recip],
             'From: john@johnmartell.net' +
             '\nTo: ' + recip +
             '\nContent-Type: text/html; charset=utf-8' +
             '\nSubject: Thanks for your RSVP' +
             "\n\n<html><body><h3>Thanks for your RSVP!</h3><div><b>Name:</b> " + obj.name + "</div><div><b>Email:</b> " + obj.email + "</div><div><b>Attending:</b> " + (obj.attending === "true" ? "Yes" : "No") + "</div><div><b>Dinner Option:</b> " + obj.dinnerOption + "</div></body></html>",
             function (err) {
                 err && console.log(err)
             });
     }catch(e) {
         console.log("MAIL SENDING ERROR: " + e);
         console.log(JSON.stringify(obj));
     }
}


router.get('/', function(req,res) {
  res.sendfile('public/index.html');
});

router.get('/rsvp', function(req,res) {

    MongoClient.connect(url, function(err, db) {
        var data = db.collection('rsvp').find({});
        db.close();
        res.send(data)
    });

});

router.post('/rsvp', function(req,res) {
  var url = process.env.M_CONNECTION_STRING;

  var json = req.body;
  var mongoObject = {
    name : decodeURI(json.name) || "NOT PROVIDED",
    email : decodeURI(json.email) || "NOT PROVIDED",
    dinnerOption : encodeURIComponent(json.dinnerOption) || "NOT PROVIDED",
    attending : json.attending
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
