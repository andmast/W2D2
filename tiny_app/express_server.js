var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser())
var PORT = 8080; // default port 8080



app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const users = {};

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
   return Math.random().toString(36).substring(2,8)
};

function emailLookUp(email){

  for(key in users){
    let check = users[key].email
    console.log("check:",check)
    if(check === email){
      console.log(true)
      return true
    } else{
      console.log(false)
      return false
    }
  }
};
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

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// this is the app.get for urls
// reqires express:1 see above and esj:2 see above
//------------------------------------------------
app.get("/urls", (req, res) => {
  let templateVars = {username: req.cookies["username"],urls: urlDatabase}
  res.render("urls_index", templateVars);
});


// // this is the app.get for urls
// // reqires express:1 see above and esj:2 see above
// //-----------------------------------------------
 app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"],urls: urlDatabase}
  res.render("urls_new",templateVars);
 });
// //------------------------------------------------



// this is the app.get for urls
// reqires express:1 see above and esj:2 see above
//------------------------------------------------
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { username: req.cookies["username"],shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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
app.get('/register',(req,res) =>{
  res.render('Registration')
});
// this is the app.post for urls
// it deletes a key vaule pair in the global url database object
//------------------------------------------------
app.post('/register',(req,res) => {
  if (!req.body.email || !req.body.password){
    return res.status(400).send();
  }
  if (emailLookUp(req.body.email)){
    return res.status(400).send();
  }

  let newuser = {
    id: generateRandomString(),
    email: req.body.email ,
    password: req.body.password ,
  }
  console.log(newuser)
  users[newuser.id] = newuser;
  console.log(users)
  res.cookie('user_id', users[newuser.id].id)
  res.redirect('/urls')
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(res.statuscode);  // Log the POST request body to the console
  delete urlDatabase[req.params.shortURL]
  // console.log(urlDatabase);
  res.redirect(`/urls`);
});
//------------------------------------------------

app.post("/login",(req,res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});


app.get("/logout",(req,res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});

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




