const router = require('express').Router();
const model = require("./auth-router-model")
const {usernameTaken,payloadValid,usernameExists} = require("./auth-routerr-middleware")
const bcrypt = require("bcryptjs")
const {SECRET} = require("../secrets")
const jwt = require("jsonwebtoken")

router.post('/register',payloadValid, usernameTaken, (req, res, next) => {
  
  let {username,password} = req.body
  password = bcrypt.hashSync(password,8)

  model.insert({username,password})
  .then(newUser => {
    res.status(200).json(newUser)
  })
  .catch(next)
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login',payloadValid,usernameExists, async (req, res, next) => { // eslint-disable-line
  const {username, password} = req.body
  const isCorrectPass = bcrypt.compareSync(password, req.user.password)
  if (isCorrectPass) {
    const token = tokenMaker(req.user)
    res.json({
      message: `welcome, ${username}`,
      token: token
    })
  } else {
    res.status(400).json("invalid credentials")
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function tokenMaker(user){
const payload = {
  subject: user.id,
  username: user.username
}
const options = {
  expiresIn: 60
}
return jwt.sign(payload, SECRET, options)
}

module.exports = router;
