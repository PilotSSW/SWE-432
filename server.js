
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
app.set('view engine', 'ejs');

firebase.initializeApp({
    serviceAccount: "privkey.json",
    databaseURL: "https://unityos-88808.firebaseio.com"
});
var fireRef = firebase.database().ref('users');

app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/', express.static(__dirname + '/public/login.html'))
app.use('/home', express.static(path.join(__dirname + '/public/home.html')))
app.get('/news', express.static(path.join(__dirname + '/public/news.html')))
app.get('/work', express.static(path.join(__dirname + '/public/work.html')))
app.get('/home', express.static(path.join(__dirname + '/public/home.html')))
app.get('/personal', express.static(path.join(__dirname + '/public/personal.html')))
app.get('/social', express.static(path.join(__dirname + '/public/social.html')))
app.get('/storage', express.static(path.join(__dirname + '/public/storage.html')))
app.get('/about', express.static(path.join(__dirname + '/public/about.html')))

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