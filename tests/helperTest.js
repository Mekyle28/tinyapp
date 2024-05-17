const { assert } = require('chai');

const { findUserByEmail } = require("../helperFunctions/functions");

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUserID = {error: null, user: 'userRandomID' };
    // Write your assert statement here
    assert.deepEqual(user, expectedUserID);
  });

  it('should return a user with valid email', function() {
    const user = findUserByEmail("user2@example.com", testUsers);
    const expectedUserID = {error: null, user: 'user2RandomID' };
    // Write your assert statement here
    assert.deepEqual(user, expectedUserID);
  });

  it('should return an object with error: message and user: null', function() {
    const user = findUserByEmail("use@example.com", testUsers);
    const expectedUserID = {error: 'No user with that email', user: null };
    // Write your assert statement here
    assert.deepEqual(user, expectedUserID);
  });


});

