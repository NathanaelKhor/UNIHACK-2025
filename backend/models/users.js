function createUser(username, password) {
  if (typeof username !== "string" || typeof password !== "string") {
    throw new Error("Username and password must be strings.");
  }

  return {
    username,
    password,
    streak: 0, // Initialize streak to 0 for new users
  };
}

module.exports = createUser;
