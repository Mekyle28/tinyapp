// new model for data base

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
    longURL: "https://www.google.ca",
    userID: "j6sLsA",
  },
};


console.log(urlDatabase);

console.log(urlDatabase["b6UTxQ"]);

console.log(urlDatabase["b6UTxQ"].longURL);

console.log(urlDatabase["b6UTxQ"].userID);


// const userUrlSorter = function() {
//   let userUrls = [];
//   for (let shortUrl in urlDatabase) {
//     console.log("short Url", shortUrl);
//     console.log("user id", urlDatabase[shortUrl].userID);
//     console.log("-----------------");
//   if (urlDatabase[shortUrl].userID === **whatever i have that holds the user ID) {
//       userUrls.push(urlDatabase[shortUrl])
//   }
// }
// return userUrls;
// }