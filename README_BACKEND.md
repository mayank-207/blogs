# GraphQL Blog Backend Setup

This document provides the GraphQL schema and resolvers needed for the backend server.

## Environment Setup

1. Copy `.env.example` to `.env` and configure your GraphQL endpoints:
```bash
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

## GraphQL Schema

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  avatar: String
  role: String!
  createdAt: String!
}

type Post {
  id: ID!
  title: String!
  content: String!
  excerpt: String
  published: Boolean!
  createdAt: String!
  updatedAt: String!
  author: User!
  comments: [Comment!]!
  commentsCount: Int!
}

type Comment {
  id: ID!
  content: String!
  createdAt: String!
  author: User!
  post: Post!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  currentUser: User
  users: [User!]!
  posts(limit: Int, offset: Int): [Post!]!
  post(id: ID!): Post
  myPosts: [Post!]!
}

type Mutation {
  register(email: String!, password: String!, name: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!

  updateUser(id: ID!, name: String, avatar: String, role: String): User!
  deleteUser(id: ID!): Boolean!

  createPost(title: String!, content: String!, excerpt: String, published: Boolean): Post!
  updatePost(id: ID!, title: String, content: String, excerpt: String, published: Boolean): Post!
  deletePost(id: ID!): Boolean!

  createComment(postId: ID!, content: String!): Comment!
  deleteComment(id: ID!): Boolean!
}

type Subscription {
  commentAdded(postId: ID!): Comment!
}
```

## Backend Implementation Notes

### Authentication
- Use JWT tokens for authentication
- Token should be passed in the Authorization header: `Bearer <token>`
- Token should contain user ID, email, name, and role

### Database Schema (Supabase)
The frontend expects the following tables:

**users**
- id (uuid, primary key)
- email (text, unique)
- name (text)
- avatar (text, nullable)
- role (text, default: 'user')
- password_hash (text)
- created_at (timestamp)

**posts**
- id (uuid, primary key)
- title (text)
- content (text)
- excerpt (text, nullable)
- published (boolean, default: true)
- author_id (uuid, foreign key to users)
- created_at (timestamp)
- updated_at (timestamp)

**comments**
- id (uuid, primary key)
- content (text)
- post_id (uuid, foreign key to posts)
- author_id (uuid, foreign key to users)
- created_at (timestamp)

### WebSocket Support
Real-time comments require WebSocket support:
- Use graphql-ws or subscriptions-transport-ws
- Implement `commentAdded` subscription that emits when a new comment is created

### Example Backend Stack
You can use:
- Apollo Server with Express
- GraphQL Yoga
- Hasura (auto-generates GraphQL from PostgreSQL)
- Postgraphile

### Sample Apollo Server Setup

```javascript
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Your typeDefs and resolvers here
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = app.listen(4000);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

useServer({ schema }, wsServer);

const server = new ApolloServer({ schema });

server.start().then(() => {
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
          try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            return { user };
          } catch (e) {
            return {};
          }
        }
        return {};
      },
    })
  );
});
```

## Testing the Frontend

Once your backend is running on `http://localhost:4000/graphql`, start the frontend:

```bash
npm run dev
```

The frontend will connect to your GraphQL server automatically.
