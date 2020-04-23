const express = require("express");
const { buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");
const crypto = require("crypto");

const app = express();

const db = {
  users: [
    {
      id: "1",
      name: "Gideon",
      email: "gideon@itthynk.co.za",
      avatarUrl: "http://avatar.com/..."
    },
    {
      id: "2",
      name: "Sarah",
      email: "sarah@itthynk.co.za",
      avatarUrl: "http://avatar.com/..."
    }
  ],
  messages: [
    { id: "1", userId: "1", body: "hello", createdAt: Date.now() },
    { id: "2", userId: "2", body: "Hi", createdAt: Date.now() },
    { id: "3", userId: "1", body: "whats up", createdAt: Date.now() }
  ]
};

class User {
  constructor(user) {
    Object.assign(this, user);
  }

  messages() {
    return db.messages.filter(message => message.userId === this.id);
  }
}

const schema = buildSchema(`
    type Query {
      users: [User!]!
      user(id: ID!): User
      messages: [Message!]!
    }

    type User {
      id: ID!
      email: String!
      name: String
      avatarUrl: String
      messages: [Message!]!
    }

    type Message {
      id: ID!
      body: String!
      createdAt: String

    }

    type Mutation {
      addUser(email: String!, name: String, avatarUrl: String): User,
      addMessage(body: String!, createdAt: String): Message
    }

  `);

const rootValue = {
  users: () => db.users.map(user => new User(user)),
  user: args => db.users.find(user => user.id === args.id),
  messages: () => db.messages,
  addUser: args => {
    const user = {
      id: crypto.randomBytes(10).toString("hex"),
      name: args.name,
      email: args.email,
      avatarUrl: args.avatarUrl
    };

    db.users.push(user);
    return user;
  },
  addMessage: args => {
    const message = {
      id: crypto.randomBytes(10).toString("hex"),
      body: args.body,
      createdAt: Date.now()
    };
    db.messages.push(message);
    return message;
  }
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
  })
);
app.listen(3000, function() {
  console.log("running on port 3000");
});
