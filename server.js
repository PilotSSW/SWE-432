
var firebase = require("firebase");
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

firebase.initializeApp({
    serviceAccount: "privkey.json",
    databaseURL: "https://unityos-88808.firebaseio.com"
});
var fireRef = firebase.database().ref('users');

var port = process.env.port || 3000;

//Make a new one
app.post('/Todo', function (req, res) {
    console.log("New req");
    console.log("Client wants to create todo: '" + req.body.todoText + "'");
    console.log("Token: " + req.body.token);
    firebase.auth().verifyIdToken(idToken).then(function (decodedToken){
        var uid = decodedToken.uid;

        fireRef.push({"text": req.body.todoText}, function () {
            res.send("OK!");
        }).catch(function(){
            res.status(403);
            res.send();
        });
    });

});
//Edit one
app.put('/Todo', function (req, res) {
    console.log("Client wants to update todo: '" +req.body.key+ " To " + req.body.todoText + "'");
    if(req.body.todoText.toLowerCase().includes("lasagna"))
    {
        res.status(403);
        res.send();
    }
    else
        firebase.auth().verifyIdToken(idToken).then(function (decodedToken) {
          console.log(JSON.stringify(decodedToken));
          var uid = decodedToken.uid;

          fireRef.child(req.body.key).set({"text": req.body.todoText}, function () {
              res.send("OK!");
          }).catch(function(){
              res.status(403);
              res.send();
          });

        }).catch( function (error) {
            console.log(error);
        });

});
//Delete one
app.delete('/Todo', function (req, res) {
    console.log("Client wants to delete todo: '" +req.body.key);
    var idToken = req.body.token;

    firebase.auth().verifyIdToken(idToken).then(function (decodedToken) {
        var uid = decodedToken.uid;

        fireRef.child(req.body.key).once("value", function(item){
            if(item.val().text.toLowerCase().includes("lasagna"))
                res.status(403);
            else
            {
                fireRef.child(req.body.key).remove();
                res.send("OK!");
              }
        }).catch(function(){
            res.status(403);
        });
      });
});

app.get('/home.html', function (req, res) {
    console.log("Requested home page");
    res.send("OK!");
});

app.use(express.static('public'));

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
