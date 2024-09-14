const db = require("../../data/dbConfig")

async function insert(user) {
    return await db("users").insert(user).then(([id]) => {
        return db("users").where({id}).first()
    })
}

async function getBy(username) {
    return await db("users").where(username).first()
}

module.exports = {
    insert,
    getBy
}