//cyclic url: https://rose-uninterested-rooster.cyclic.app

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var app = express();
var final = require("./final.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/finalViews/home.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "/finalViews/register.html"));
});

app.post("/register", (req, res) => {
  final.register(req.body)
  .then(function (data) {
    res.send(data.email + " registered successfully.<br><a href=/>Go Home</a>")
  })
  .catch(function (err) {
    res.send(err)
  });
});

app.get("/signIn", (req, res) => {
  res.sendFile(path.join(__dirname, "/finalViews/signIn.html"));
});

app.post("/signIn", (req, res) => {
  final.signIn(req.body)
  .then(function (data) {
    res.send(data.email + " signed in successfully.<br><a href=/>Go Home</a>")
  })
  .catch(function (err) {
    res.send(err)
  });
});

//404 not found
app.use((req, res) => {
    res.send('Not found.');
  });

  // setup http server to listen on HTTP_PORT
final.startDB()
.then(function(data){
  app.listen(HTTP_PORT, onHttpStart);
})
.catch(function(reason){
  console.log(reason);
});
