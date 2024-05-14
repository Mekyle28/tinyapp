const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:id/', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});

app.post("/urls/:id/update", (req, res) => {
  const shortURL = req.params.id;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

