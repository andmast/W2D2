var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();

var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");

const users = {};

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

function loggedIn(user_id) {
  // if ()





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
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  console.log("users cookie",users[cookie_user_id]);

  let templateVars = users[cookie_user_id]
  res.render("urls_index", templateVars);
});


// // this is the app.get for urls
// // reqires express:1 see above and esj:2 see above
// //-----------------------------------------------
 app.get("/urls/new", (req, res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  console.log("users cookie",users[cookie_user_id]);

  let templateVars = users[cookie_user_id]
  res.render("urls_new",templateVars);
 });
// //------------------------------------------------



// this is the app.get for urls
// reqires express:1 see above and esj:2 see above
//------------------------------------------------
app.get("/urls/:shortURL", (req, res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  console.log("users cookie",users[cookie_user_id]);

  let templateVars = users[cookie_user_id]
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
    return res.status(400).send('please enter email or password');
  }
  if (emailLookUp(req.body.email)){
    return res.status(400).send("Email in use try again");
  }
  let newuser = {
    id: generateRandomString(),
    email: req.body.email ,
    password: req.body.password ,
    urlDatabase: {
      "test": "testing"
    }
  };
  console.log(newuser)
  users[newuser.id] = newuser;
  console.log(users)
  res.cookie('user_id', users[newuser.id].id)
  res.redirect('/urls')
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  console.log("users cookie",users[cookie_user_id]);

  delete users[cookie_user_id].urlDatabase[req.params.shortURL]
  res.redirect(`/urls`);
});

//------------------------------------------------

app.post("/login",(req,res) => {
  // if ()
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  let templateVars = users[cookie_user_id]
  res.redirect("/urls",templateVars);
});


app.get("/logout",(req,res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  res.clearCookie('username');
  res.redirect("/login");
});


//-----------------------------------------------
app.post("/urls", (req, res) => {
  let key = generateRandomString()
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  users[cookie_user_id].urlDatabase[key] = req.body.longURL;
  res.redirect(`/urls`);
});
//------------------------------------------------



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




