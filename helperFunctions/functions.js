// const users = {
//   userRandomID: {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur",
//   },
//   user2RandomID: {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk",
//   },
// };
// //not in the system
// const reqBodyExample1 = {email: "bobbyjoe@hayo.net", password: "0wehcbs"};
// const reqBodyExample2 = {email: "user2@example.com", password: "wehcbs"};
// const reqBodyExample3 = {email: "bobbyjoe@hayo.net", password: ""};

const RandomId = function() {
  return Math.random().toString(36).slice(2, 8);
};


const registerUser = function(newUserInfoObj, users) {
  const checkEmailObj = findUserByEmail(newUserInfoObj.email, users);
  // is there was no error then the email was found and an account with it already exists
  if (!checkEmailObj.error) {
    return {error: "An account with that email already exists"};
  }

  if ((newUserInfoObj.email).length < 1 || (newUserInfoObj.password).length < 1) {
    return {error: "all fields must be filled in to create an account!", user: null};
  }

  const newUser = {
    email: newUserInfoObj.email,
    password: newUserInfoObj.password,
    id: RandomId()
  };

  return {error: null, user: newUser};

};



const userAuthentication = function(email, password, users) {
  const userObj = findUserByEmail(email, users);
  // if error is present the email wasn't found
  if (userObj.error) {
    return {error: `Error: email not found :( please make sure ${email} is the correct email`, user: null};
  }
  if (userObj.user.password !== password) {
    return {error: `Error: invalid password`, user: null};
  }
  const userInfo = userObj.user;
  return {error: null, user: userInfo};
};


const findUserByEmail = function(email, users) {
  const userIdArr = Object.keys(users);
  
  for (let idNum of userIdArr) {
    if (users[idNum].email === email) {
      return {error: null, user: users[idNum]};
    }
  }
  return {error: "No user with that email", user: null};
};


const findUserById = function(id, users) {
  if (!Object.keys(users).includes(id)) {
    return {error: "id not found", user: null};
  }
  return {error: null, user: users[id]};
  
};

module.exports = { registerUser, userAuthentication, findUserByEmail, findUserById};

// //test user authenticate

// console.log("email password match", userAuthentication("user2@example.com", "dishwasher-funk", users));
// console.log("email matches -- password no match", userAuthentication("user2@example.com", "dishwashefunk", users));
// console.log("email no match -- password match", userAuthentication("user2@exale.com", "dishwasher-funk", users));

// //test findUserById
// console.log("id valid", findUserById("user2RandomID", users));
// console.log("invalid id", findUserById("jw754f", users));

// // test registerUser
// console.log("register user email already exist", registerUser(reqBodyExample2, users));
// console.log("register user email new person", registerUser(reqBodyExample1, users));
// console.log("register user email new person empty field", registerUser(reqBodyExample3, users));

// // test case for findUserByEmail
// console.log("find user by email 1", findUserByEmail("user@example.com", users));
// console.log("find user by email 2", findUserByEmail("bob@example.com", users));