var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();

var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");
app.use(function(req, res, next) {
  console.log("Headers: ", req.headers.cookie)
  console.log("Cookies: ", req.cookies)
  console.log("Signed: ", req.signedCookies)
  next()
})

const users = {};
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
console.log(users)

function generateRandomString() {
   return Math.random().toString(36).substring(2,8)
};

function emailLookUp(email){
  for(key in users){
    let check = users[key].email
    if(check === email){
      return users[key]
    }
  }
};

app.get("/", (req, res) => {
  res.render("login");
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get("/urls", (req, res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  let templateVars = users[cookie_user_id]
  res.render("urls_index", templateVars);
});

 app.get("/urls/new", (req, res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id

  let templateVars = users[cookie_user_id]
  res.render("urls_new",templateVars);
 });

app.get("/urls/:shortURL", (req, res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  let templateVars = users[cookie_user_id]
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  let url = req.params.shortURL
  res.redirect(`/urls/${url}`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  let key = req.params.shortURL;
  let templateVars = {
    id: cookie_user_id,
    email: users[cookie_user_id].email,
    shortURL: key,
    longURL: users[cookie_user_id].urlDatabase[req.params.shortURL] } ;
  res.redirect(`/urls/${key}`, templateVars);
});

app.get('/register',(req,res) =>{
  res.render('Registration')
});

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
  res.redirect('/login')
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  delete users[cookie_user_id].urlDatabase[req.params.shortURL]
  res.redirect(`/urls`);
});


app.get("/login",(req,res)=>{
  res.render("login");
});


app.post("/login",(req,res) => {
  let check = emailLookUp(req.body.email)
  if (check === undefined){
    res.redirect("/register");
  } else if (check.email === req.body.email && check.password === req.body.password) {
    res.cookie('user_id', check.id)
    console.log("email",check.email,"password",check.password);
    res.redirect("/urls");
  } else if (check.mail !== req.body.mail){
    res.status(400).send("No account registered. Please register");
  } else if (check.password !== req.body.password){
    res.status(400).send("wrong password");
  }

});


app.get("/logout",(req,res) => {
  let cookie_user_id = ('Cookies: ', req.cookies).user_id
  res.clearCookie(`${cookie_user_id}`);
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




