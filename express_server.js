const express = require("express");
const { registerUser, userAuthentication, findUserById, urlsForUser, generateRandomString } = require('./helperFunctions/functions');
const {users, urlDatabase} = require('./database/database');
const cookieSession = require('cookie-session');
const morgan = require("morgan");
const app = express();
const PORT = 8000;

app.set("view engine", "ejs");

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ["chicken55942"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use((req, res, next) => {
  const {error} = findUserById(req.session["userid"], users);
  const whiteList = ["/", "/login", "/register", "/urls", "/u/:id", "/urls/:id"];

  if (error && !whiteList.includes(req.url) && !req.url.match(/^\/u\/[a-zA-Z0-9]+$/)) {
    res.status(403);
    const templateVars = {user: users[req.session["userid"]], urls: urlDatabase };
    res.render("message_login", templateVars);
  }
  return next();
});


app.get("/", (req, res) => {
  if (!req.session["userid"]) {
    res.redirect("/login");
  }
  const templateVars = { user: users[req.session["userid"]], urls: urlDatabase };
  res.render("home_page", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  if (req.session["userid"]) {
    return res.redirect("/urls");
  }
  const templateVars = { user: users[req.session["userid"]], urls: urlDatabase };
  res.render("login", templateVars);
});


app.get("/urls", (req, res) => {
  const userUrls = urlsForUser(req.session["userid"], urlDatabase);

  const templateVars = { user: users[req.session["userid"]], userUrls: userUrls };
  console.log("template vars", templateVars);
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  if (req.session["userid"]) {
    return res.redirect("/urls");
  }
  const templateVars = { user: users[req.session["userid"]] };
  res.render("register", templateVars);
});

app.get("/urls/new", (req, res) => {

  const templateVars = { user: users[req.session["userid"]] };
  res.render("urls_new", templateVars);
});

app.get('/urls/:id/', (req, res) => {
  if (!req.session["userid"]) {
    const templateVars = { user: users[req.session["userid"]], urls: urlDatabase };
    res.render("message_login", templateVars);
  }
  if (urlDatabase[req.params.id]["userID"] !== req.session["userid"]) {
    res.status(403);
    const templateVars = { error: "Error: you do not have acsess to this Url", user: users[req.session["userid"]] };
    res.render("error_page", templateVars);
  }
  const templateVars = {
    user: users[req.session["userid"]],
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});


app.post("/register", (req, res) => {
  const regUserinfo = registerUser(req.body, users);
  if (regUserinfo.error) {
    res.status(400);
    const templateVars = { error: regUserinfo.error, user: users[req.session["userid"]] };
    res.render("failed_registration", templateVars);
  }
  users[regUserinfo.user.id] = regUserinfo.user;
  req.session.userid = regUserinfo.user.id;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  const userUrls = urlsForUser(req.session["userid"], urlDatabase);
  if (!req.session["userid"]) {
    res.send(`Sorry, please login to delete ${urlDatabase[req.params.id]}`);
    return;
  }
  if (!userUrls[req.params.id]) {
    return res.send("Sorry, you can only delete Urls you created");
  }
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});

// the request from the update button that brings you to the urls/id page where you can make the actual edit
app.post("/urls/:id/update", (req, res) => {
  if (!req.session["userid"]) {
    res.send(`Sorry, please login to update ${urlDatabase[req.params.id]}`);
    return;
  }
  const shortURL = req.params.id;
  res.redirect(`/urls/${shortURL}`);
});

//make new url
app.post("/urls", (req, res) => {
  const tempShortULR = generateRandomString();
  const tempShortULRObj = {
    longURL: req.body.longURL,
    userID: req.session["userid"],
    id: tempShortULR
  };

  urlDatabase[tempShortULR] = tempShortULRObj;
  res.redirect(`/urls/${tempShortULR}`); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/edit", (req, res) => {
  const shortU = (req.params.id);
  urlDatabase[shortU].longURL = req.body.updateLongURL;
  res.redirect("/urls");

});

app.post("/login", (req, res) => {
  const login = userAuthentication(req.body.email, req.body.password, users);
  if (login.error) {
    return res.status(403).send(login.error);
  }
  console.log("returned user:", login.user);
  req.session.userid = login.user;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

