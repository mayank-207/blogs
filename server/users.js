const bcrypt = require("bcryptjs");

// simulate DB
const users = [
  {
    id: "1",
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10),
  },
];

module.exports = users;
