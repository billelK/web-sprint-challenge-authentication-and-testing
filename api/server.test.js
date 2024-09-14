const server = require("../api/server")
const request = require("supertest")
const db = require("../data/dbConfig")

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

test("sanity 2", () => {
  expect(process.env.NODE_ENV).toBe("testing")
})

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

describe("[Post] api/auth/register", () => {
  test("registering returns the new users id,username,hashed password" ,async() => {
    const newUser = {username: "badis", password: "123"}
    const expected = {id: 1, username:"badis"}
    const res = await request(server).post("/api/auth/register").send(newUser)
    expect(res.body).toMatchObject(expected)
  })
  test("registering adds the registered new user to the database", async()=> {
    const newUser = {username: "badis", password: "123"}
    expect(await db("users")).toHaveLength(0)
    const res = await request(server).post("/api/auth/register").send(newUser)
    expect(await db("users")).toHaveLength(1)
    expect(await db("users").where("id",res.body.id).first()).toMatchObject({username:"badis"})
  })
})

describe("[Post] api/auth/login", () => {
  test("logging in with wrong credentials returns err msg",async() => {
    const user = {username: "badis", password: "123"}
    const res = await request(server).post("/api/auth/login").send(user)
    expect(res.body).toBe("invalid credentials")
  })
  test("logging in returns the message 'welcome lell'", async() => {
    const newUser = {username: "lell", password: "123"}
    await request(server).post("/api/auth/register").send(newUser)
    const res = await request(server).post("/api/auth/login").send(newUser)
    expect(res.body.message).toBe(`welcome, ${newUser.username}`)
  })
})

describe("[get] api/jokes", () => {
  test("returns error msg if token unvalid", async() => {
    const newUser = {username: "lell", password: "123"}
    await request(server).post("/api/auth/register").send(newUser)
    const res = await request(server).get("/api/jokes")
    expect(res.body).toBe("token required")
  })
  test("returns the jokes data when logged in properly", async() => {
    const newUser = {username: "alchino", password: "123"}
    await request(server).post("/api/auth/register").send(newUser)
    const res = await request(server).post("/api/auth/login").send(newUser)
    const res1 = await request(server).get("/api/jokes").set('Authorization', `Bearer ${res.body.token}`)
    expect(res1.body).toBe("token invalid")
    const res2 = await request(server).get("/api/jokes").set('Authorization', `${res.body.token}`)
    expect(res2.body).toHaveLength(3)
  })
})
