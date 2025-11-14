const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("./users");

const SECRET = "MY_SUPER_SECRET"; // move to env later

module.exports = {
  Query: {
    me: (_, __, { user }) => user || null,
  },

  Mutation: {
    async login(_, { email, password }) {
      const foundUser = users.find((u) => u.email === email);
      if (!foundUser) throw new Error("User not found");

      const valid = await bcrypt.compare(password, foundUser.password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign(
        { userId: foundUser.id, email: foundUser.email },
        SECRET,
        { expiresIn: "1h" }
      );

      return {
        token,
        user: foundUser,
      };
    },

    logout() {
      // Client clears token — server doesn't need to track it.
      return true;
    },
  },
};
