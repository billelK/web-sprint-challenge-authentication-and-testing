const model = require("./auth-router-model")

async function payloadValid (req,res,next) {
    const {username,password} = req.body
    
    if (username && password) {
        next()
    } else {
        res.status(400).json("username and password required")
    }
}

async function usernameTaken(req,res,next) {
    const {username} = req.body
    const user = await model.getBy({username})
   
    if (user) {
        res.status(400).json("username taken")
    } else {
        next()
    }
}

async function usernameExists(req,res,next) {
    const {username} = req.body
    const user = await model.getBy({username})
    

    if (user) {
        req.user = user
        next()
    } else {
        res.status(400).json("invalid credentials")
    }
}

module.exports = {
    usernameTaken,
    payloadValid,
    usernameExists
}