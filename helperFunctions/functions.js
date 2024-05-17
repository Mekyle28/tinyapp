const bcrypt = require("bcryptjs");


const urlsForUser = function(userID, urlDatabase) {
  let userUrlDatabase = {};
  for (let shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === userID) {
      userUrlDatabase[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return userUrlDatabase;
};


const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const RandomId = function() {
  return Math.random().toString(36).slice(2, 8);
};


const registerUser = function(newUserInfoObj, users) {
  const checkEmailObj = findUserByEmail(newUserInfoObj.email, users);
  // is there was no error then the email was found and an account with it already exists
  if (!checkEmailObj.error) {
    return { error: "An account with that email already exists" };
  }

  if ((newUserInfoObj.email).length < 1 || (newUserInfoObj.password).length < 1) {
    return { error: "all fields must be filled in to create an account!", user: null };
  }
  const hashedPassword = bcrypt.hashSync(newUserInfoObj.password, 10);
  const newUser = {
    email: newUserInfoObj.email,
    password: hashedPassword,
    id: RandomId()
  };
  console.log(newUser);
  return { error: null, user: newUser };
};


const userAuthentication = function(email, password, users) {
  const userObj = findUserByEmail(email, users);
  const idNum = userObj.user;
  // if error is present the email wasn't found
  if (userObj.error) {
    return { error: `Error: email not found :( please make sure ${email} is the correct email`, user: null };
  }
  if (!bcrypt.compareSync(password, users[idNum].password)) {
    return { error: `Error: invalid password`, user: null };
  }
  return { error: null, user: idNum };
};


const findUserByEmail = function(email, users) {
  const userIdArr = Object.keys(users);

  for (let idNum of userIdArr) {
    if (users[idNum].email === email) {
      return { error: null, user: idNum };
    }
  }
  return { error: "No user with that email", user: null };
};


const findUserById = function(id, users) {
  if (!Object.keys(users).includes(id)) {
    return { error: "id not found", user: null };
  }
  return { error: null, user: users[id] };

};

module.exports = { registerUser, userAuthentication, findUserById, urlsForUser, generateRandomString};

