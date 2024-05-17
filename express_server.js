const express = require("express");
const { registerUser, userAuthentication, findUserByEmail, findUserById, urlsForUser} = require('./helperFunctions/functions');
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');
const morgan = require("morgan");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["chicken55942"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// app.use((req, res, next) => {
//   const {error} = findUserById(req.session["userid"], users);
//   const whiteList = ["/", "/login", "/register"];

//   if (error && !whiteList.includes(req.url)) {
//     return res.redirect("/login");
//   }
//   return next();
// });

app.use((req, res, next) => {
  const {error} = findUserById(req.session["userid"], users);

  if (error && (req.url === "/urls/new")) {
    return res.redirect("/login");
  }
  return next();
});

const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

let users = {aJ48lW: {email: "bob@123", password: "$2a$10$EdXSeb1l/kvkvEtIk31M/Op3T6mL.M9KYq9KY0OkWEiXE6ldm4mRK"}};

// const urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
// };

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",

  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },

  k3JoXr: {
    longURL: "https://www.google.com",
    userID: "j6sLsA",
  },
};

app.get("/", (req, res) => {
  const templateVars = {user: users[req.session["userid"]], urls: urlDatabase };
  res.render("home_page", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  if (req.session["userid"]) {
    return res.redirect("/urls");
  }
  const templateVars = {user: users[req.session["userid"]], urls: urlDatabase };
  res.render("login", templateVars);
});


// const urlsForUser = function(userID, urlDatabase) {
//   console.log(userID);
//   let userUrls = [];
//   for (let shortUrl in urlDatabase) {
//     console.log("short Url obj", urlDatabase[shortUrl]);
//     console.log("user id", urlDatabase[shortUrl].userID);
//     console.log("-----------------");
//     if (urlDatabase[shortUrl].userID === userID) {
//       userUrls.push(urlDatabase[shortUrl]);
//     }
//   }
//   console.log(userUrls);
//   return userUrls;
// };

// const urlsForUser = function(userID, urlDatabase) {
//   console.log(userID);
//   let userUrlDatabase = {};
//   for (let shortUrl in urlDatabase) {
//     console.log("short Url obj", urlDatabase[shortUrl]);
//     console.log("-----------------");
//     if (urlDatabase[shortUrl].userID === userID) {
//       userUrlDatabase[shortUrl] = urlDatabase[shortUrl];
//     }
//   }
//   console.log("******************");
//   console.log("userUrlDatabase ", userUrlDatabase);
//   return userUrlDatabase;
// };

app.get("/urls", (req, res) => {
  const userUrls = urlsForUser(req.session["userid"], urlDatabase);
  
  const templateVars = {user: users[req.session["userid"]], userUrls: userUrls};
  console.log("template vars", templateVars);
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  if (req.session["userid"]) {
    return res.redirect("/urls");
  }
  const templateVars = {user: users[req.session["userid"]]};
  res.render("register", templateVars);
});

app.get("/urls/new", (req, res) => {

  const templateVars = {user: users[req.session["userid"]]};
  res.render("urls_new", templateVars);
});

app.get('/urls/:id/', (req, res) => {
  const templateVars = {user: users[req.session["userid"]],
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL};
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
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
    const templateVars = {error: regUserinfo.error, user: users[req.session["userid"]]};
    res.render("failed_registration", templateVars);
  }
  users[regUserinfo.user.id] = regUserinfo.user;
  req.session.userid = regUserinfo.user.id;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  if (!req.session["userid"]) {
    res.send(`Sorry, please login to delete ${urlDatabase[req.params.id]}`);
    return;
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
  const tempShortULRObj = {longURL: req.body.longURL,
    userID: req.session["userid"],
    id: tempShortULR};
  
  console.log("tempShortURL should be alone", tempShortULR);
  console.log("tempShortURLobj should be object with three thisngs", tempShortULRObj);
  urlDatabase[tempShortULR] = tempShortULRObj;
  console.log("Updated Url Database", urlDatabase);
  res.redirect(`/urls/${tempShortULR}`); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/edit", (req, res) => {
  const shortU = (req.params.id);
  urlDatabase[shortU].longURL = req.body.updateLongURL;
  console.log("---------'");
  console.log("updated database after url has been edited", urlDatabase);
  console.log("---------'");
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

// res.status(400).send(regUserinfo.error);
// return;

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

