
var firebase = require("firebase");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var port = process.env.PORT || 8080;
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static('public'))
app.use('/static', express.static('public'))
app.use(express.static(path.join(__dirname, '/public/')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/'));

firebase.initializeApp({
    serviceAccount: "privkey.json",
    databaseURL: "https://unityos-88808.firebaseio.com"
});
var fireRef = firebase.database().ref('users');

app.get('/', function(req, res) {res.render('login');});
app.get('/home', function(req, res) {res.render('home');});
app.get('/news', function(req, res) {res.render('news');});
app.get('/work', function(req, res) {res.render('work');});
app.get('/usage', function(req, res) {res.render('usage');});
app.get('/social', function(req, res) {res.render('social');});
app.get('/storage', function(req, res) {res.render('storage');});
app.get('/personal', function(req, res) {res.render('personal');});


app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});


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
              res.send(home.html);
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