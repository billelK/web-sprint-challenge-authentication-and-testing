// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

test("sanity 2", () => {
  expect(process.env.NODE_ENV).toBe("testing")
})

describe("[Post] api/auth/register", () => {
  test.todo("registering returns the  new users id,username,hashed password")
  test.todo("registering adds the registered new user to the database")
})

describe("[Post] api/auth/login", () => {
  test.todo("logging in with wrong credentials returns err msg")
  test.todo("logging in returns the message 'welcome lell'")
})

describe("[get] api/jokes", () => {
  test.todo("returns if token unvalid or unavailable returns error msg")
  test.todo("returns the jokes data when logged in properly")
})
