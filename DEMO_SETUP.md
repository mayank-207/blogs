# Demo Setup Guide

This document provides instructions for setting up the GraphQL Blog Platform for demonstrations.

## Demo Credentials

Use these credentials to log in and explore the platform:

### Regular User
- **Email:** demo@example.com
- **Password:** demo123456
- **Role:** User (can create posts and comments)

### Admin User
- **Email:** admin@example.com
- **Password:** admin123456
- **Role:** Admin (can manage all users and access user management panel)

## Quick Start

1. **Start the Frontend**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

2. **Access the Landing Page**
   - You'll see the landing page with demo buttons
   - Click "Try Demo (User)" to instantly log in as a regular user
   - Click "Try Demo (Admin)" to log in with admin privileges

3. **Explore Features**

   **As a Regular User:**
   - View all blog posts from the community
   - Create a new blog post
   - Edit or delete your own posts
   - Add comments to any post
   - View your posts in "My Posts"

   **As an Admin:**
   - Access the User Management panel
   - View, edit, and delete users
   - Change user roles between "user" and "admin"
   - See all user information and join dates

## Backend Setup for Demo

To make the demo fully functional, you need to set up a GraphQL backend server.

### Sample GraphQL Backend (Node.js + Apollo Server)

```javascript
// server.js
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-change-in-production';

// Demo users
const demoUsers = {
  'demo@example.com': {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user',
    password: 'demo123456'
  },
  'admin@example.com': {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123456'
  }
};

// Demo posts
const demoPosts = [
  {
    id: '1',
    title: 'Getting Started with GraphQL',
    content: 'GraphQL is a powerful query language for APIs. In this post, we explore the basics...',
    excerpt: 'Learn the fundamentals of GraphQL',
    published: true,
    authorId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Real-Time Applications with Subscriptions',
    content: 'GraphQL subscriptions enable real-time data updates. Discover how to implement...',
    excerpt: 'Build real-time features with GraphQL',
    published: true,
    authorId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const typeDefs = `
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    excerpt: String
    published: Boolean!
    author: User!
    comments: [Comment!]!
    commentsCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    post: Post!
    createdAt: String!
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
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!, name: String!): AuthPayload!
    updateUser(id: ID!, name: String, role: String): User!
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
`;

const resolvers = {
  Query: {
    currentUser: (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return demoUsers[context.user.email];
    },
    users: () => Object.values(demoUsers),
    posts: () => demoPosts,
    post: (_, { id }) => demoPosts.find(p => p.id === id),
    myPosts: (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return demoPosts.filter(p => p.authorId === context.user.id);
    }
  },

  Mutation: {
    login: (_, { email, password }) => {
      const user = demoUsers[email];
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET);
      return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    },
    register: (_, { email, password, name }) => {
      if (demoUsers[email]) throw new Error('User already exists');
      const id = String(Object.keys(demoUsers).length + 1);
      demoUsers[email] = { id, email, name, role: 'user', password };
      const token = jwt.sign({ email, id }, JWT_SECRET);
      return { token, user: { id, email, name, role: 'user' } };
    },
    createPost: (_, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const post = {
        id: String(demoPosts.length + 1),
        ...args,
        authorId: context.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      demoPosts.push(post);
      return post;
    }
  },

  Post: {
    author: (post) => demoUsers[Object.values(demoUsers).find(u => u.id === post.authorId).email],
    comments: () => [],
    commentsCount: () => 0
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  const app = express();
  const server = new ApolloServer({ schema });

  await server.start();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return { user: decoded };
          } catch (e) {
            throw new Error('Invalid token');
          }
        }
        return {};
      }
    })
  );

  app.listen(4000, () => {
    console.log('Apollo Server running on http://localhost:4000/graphql');
  });
}

startServer();
```

### Configure Frontend Environment

Create or update `.env`:

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

## Features to Demonstrate

### 1. Authentication
- Show login/register page
- Demonstrate quick demo login
- Show user info in navbar

### 2. Blog Posts
- Browse all posts
- Create a new post
- Edit and delete posts
- View post details with comments

### 3. Real-Time Comments
- Add a comment to a post
- Show real-time comment updates
- Delete your own comments

### 4. Admin Features (Admin mode)
- Access User Management
- View all users
- Edit user information
- Change user roles
- Delete users

### 5. Responsive Design
- Show mobile-friendly layout
- Demonstrate navigation
- Show hover effects and transitions

## Demo Talking Points

1. **Modern Tech Stack** - React 18, Vite, TypeScript, GraphQL, Apollo Client
2. **Real-Time Features** - GraphQL subscriptions for instant comment updates
3. **JWT Authentication** - Secure token-based authentication
4. **Role-Based Access** - Admin and user roles with different permissions
5. **Beautiful UI** - Clean, modern design with Tailwind CSS
6. **Responsive Design** - Works perfectly on mobile, tablet, and desktop

## Tips for Demo

- Use a pre-created GraphQL backend or mock server
- Create a few demo posts and comments beforehand
- Switch between user and admin roles to show different features
- Highlight the real-time comment functionality
- Show the responsive design on different screen sizes
- Mention the tech stack and architecture decisions
