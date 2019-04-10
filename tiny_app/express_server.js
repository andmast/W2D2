var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
   return Math.random().toString(36).substring(2,8)
}
// this is the app.get for  urls/hello
// reqires express:1 see below and esj:2 see below

// 1: var express = require("express");
//    var app = express();

// 2: app.set("view engine", "ejs");
//------------------------------------------------
app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});
//------------------------------------------------



// this is the app.get for urls
// reqires express:1 see above and esj:2 see above
//------------------------------------------------
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase}
  res.render("urls_index", templateVars);
});


// // this is the app.get for urls
// // reqires express:1 see above and esj:2 see above
// //-----------------------------------------------
 app.get("/urls/new", (req, res) => {
   res.render("urls_new");
 });
// //------------------------------------------------



// this is the app.get for urls
// reqires express:1 see above and esj:2 see above
//------------------------------------------------
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
//------------------------------------------------
app.post("/urls/:shortURL", (req, res) => {
  let url = req.params.shortURL
  res.redirect(`/urls/${url}`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
   urlDatabase[req.params.shortURL] = req.body.longURL  // Log the POST request body to the console

  // console.log(urlDatabase);
  res.redirect(`/urls/`);
});

// this is the app.post for urls
// it deletes a key vaule pair in the global url database object
//------------------------------------------------
app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(res.statuscode);  // Log the POST request body to the console
  delete urlDatabase[req.params.shortURL]
  // console.log(urlDatabase);
  res.redirect(`/urls`);
});

//------------------------------------------------

//------------------------------------------------


// this is the app.post for urls
// reqires express:1 see above + esj:2 see above and bodyparser:3 see below

// 3: const bodyParser = require("body-parser");
//    app.use(bodyParser.urlencoded({extended: true}));
//-----------------------------------------------
app.post("/urls", (req, res) => {
  // console.log(res.statuscode);  // Log the POST request body to the console
  let key = generateRandomString()
  urlDatabase[key] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${key}`);
});
//------------------------------------------------



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




