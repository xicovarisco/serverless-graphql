import mongoose from 'mongoose';
import Database from './db';
import models from './models';
const Users = mongoose.model('Users');
const { ApolloServer, gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Users {
    _id: ID!
    email: String
  }
  type Query {
    hello: String
    fetchUsers: [Users]
  }
`;

const resolvers = {
    Query: {
        hello: (parent, args, context) => {
            return "Hello, world!";
        },
        fetchUsers: () => {
          console.log('test');
            return Users.find();
        }
    }
};

exports.handler = async (event, context) => {
  await Database.connect();
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });
  return new Promise((yay, nay) => {
    const cb = (err, args) => (err ? nay(err) : yay(args));
    server.createHandler()(event, context, cb);
  });
};