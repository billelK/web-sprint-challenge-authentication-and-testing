const jwt = require("jsonwebtoken")
const {SECRET} = require("../secrets")

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if(token) {
    jwt.verify(token,SECRET, (err, decode) =>{  
      if(err) {
        res.json("token invalid")
      } else {
        req.decodedJWT = decode
        next()
      }
    })
  } else {
    res.status(400).json("token required")
  } 
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
