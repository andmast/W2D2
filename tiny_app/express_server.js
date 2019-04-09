var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));




app.post("/urls", (req, res) => {
  console.log(res.statuscode);  // Log the POST request body to the console
  let key = generateRandomString()
  urlDatabase[key] = req.body.longURL;

  console.log(urlDatabase);
  res.redirect(`/urls/${key}`);
});





function generateRandomString() {
   return Math.random().toString(36).substring(2,8)
}
console.log(generateRandomString())
console.log(generateRandomString())
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase}
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});