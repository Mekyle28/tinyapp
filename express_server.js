const express = require("express");
const cookieParser = require('cookie-parser');
const { registerUser, userAuthentication, findUserByEmail, findUserById} = require('./helperFunctions/functions');
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

app.get("/login", (req, res) => {
  const templateVars = {user: users[req.cookies["userid"]], urls: urlDatabase };
  res.render("login", templateVars);
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
  //const userInfoFromForm = req.body;
  //console.log("info from form", userInfoFromForm);
  const regUserinfo = registerUser(req.body, users);
  console.log("info from function", regUserinfo);
  if (regUserinfo.error) {
    // res.status(400).send(regUserinfo.error);
    // return;
    const templateVars = {error: regUserinfo.error, user: users[req.cookies["userid"]]};
    res.render("failed_registration", templateVars);
  }
  users[regUserinfo.user.id] = regUserinfo.user;
  res.cookie("userid", regUserinfo.user.id);
  res.redirect("/urls");
  // let userId = generateRandomString();
  // console.log(req.body);
  // const email = req.body.email;
  // const password = req.body.password;
  // users[userId] = {id: userId, email: email, password: password};

  // res.cookie("userid", userId);
  // // console.log("please work cookies", req.cookies["userid"]);
  // // console.log(users);
  // // console.log(users[userId]);
  // // console.log(users[req.cookies["userid"]]);
  // res.redirect("/urls");
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
  const login = userAuthentication(req.body.email, req.body.password, users);
  if (login.error) {
    return res.status(403).send(login.error);
  }
  console.log("returned user:", login.user);
  res.cookie("userid", login.user);
  res.redirect("/urls");
});

// res.status(400).send(regUserinfo.error);
// return;

app.post("/logout", (req, res) => {
  res.clearCookie("userid");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

