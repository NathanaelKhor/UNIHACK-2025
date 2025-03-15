function createUser(username, ) {
    if (typeof username !== "string") {
      throw new Error("Username must be a string.");
    }
  
    return {
      username
    };
  }
  
  module.exports = createUser;