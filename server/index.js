const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const SECRET = "MY_SUPER_SECRET";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";

    if (token) {
      try {
        const user = jwt.verify(token.replace("Bearer ", ""), SECRET);
        return { user };
      } catch (err) {
        console.log("Invalid token");
      }
    }

    return {};
  },
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
