const model = require("./auth-router-model")

async function payloadValid (req,res,next) {
    const {username,password} = req.body
    if (username && password) {
        next()
    } else {
        res.json("username and password required")
    }
}

async function usernameExists(req,res,next) {
    const {username} = req.body
    const user = await model.getBy({username})
    console.log(user);
    
    if (user) {
        res.json("username taken")
    } else {
        next()
    }
}

module.exports = {
    usernameExists,
    payloadValid
}