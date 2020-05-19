import Database from './db';
const { ApolloServer, gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
    Query: {
        hello: (parent, args, context) => {
            return "Hello, world!";
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