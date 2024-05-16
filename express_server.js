const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

let users = {};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = {user: users[req.cookies["userid"]], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {user: users[req.cookies["userid"]]};
  res.render("register", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.cookies["userid"]]};
  res.render("urls_new", templateVars);
});

app.get('/urls/:id/', (req, res) => {
  const templateVars = {user: users[req.cookies["userid"]],
    id: req.params.id,
    longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});


app.post("/register", (req, res) => {
  let userId = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  users[userId] = {id: userId, email: email, password: password};
  // console.log("users obj:", users);
  // const userValues = (Object.values(users));
  // for (let user of users) {
  //   console.log("values", user);
  //   console.log("email", user[email]);
  //   if (user[email] === email) {
  //     console.log(`error! there is already an account with the username ${user[email]}`);
  //   }
  //};
  res.cookie("userid", userId);
  // console.log("please work cookies", req.cookies["userid"]);
  // console.log(users);
  // console.log(users[userId]);
  // console.log(users[req.cookies["userid"]]);
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});

app.post("/urls/:id/update", (req, res) => {
  const shortURL = req.params.id;
  res.redirect(`/urls/${shortURL}`);
});


app.post("/urls", (req, res) => {
  const tempShortULR = generateRandomString();
  urlDatabase[tempShortULR] = req.body.longURL;
  res.redirect(`/urls/${tempShortULR}`); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/edit", (req, res) => {
  const shortU = (req.params.id);
  urlDatabase[shortU] = req.body.updateLongURL;
  res.redirect("/urls");
  
});

app.post("/login", (req, res) => {
  const username = req.body;
  res.cookie("username", username.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  // const username = req.body;
  res.clearCookie("userid");
  // res.clearCookie("username");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

