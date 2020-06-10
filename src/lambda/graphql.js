import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server-lambda';
dotenv.config();

// Shared connection variable
let conn;
const { dbUser, dbPassword, dbName } = process.env;

const typeDefs = gql`
  type Users {
    _id: ID!
    email: String
  }
  type Query {
    fetchUsers: [Users]
  }
`;

const resolvers = {
    Query: {
        fetchUsers: async () => {
          const Users = conn.model('users');
          return Users.find();
        }
    }
};

exports.handler = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  context.callbackWaitsForEmptyEventLoop = false;
  // Creates a connection on the db
  if (conn == null) {
    const uri = `mongodb://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@prod-cluster-shard-00-00-mhiuv.mongodb.net:27017,prod-cluster-shard-00-01-mhiuv.mongodb.net:27017,prod-cluster-shard-00-02-mhiuv.mongodb.net:27017/${encodeURIComponent(dbName)}?ssl=true&replicaSet=Prod-Cluster-shard-0&authSource=admin&retryWrites=true&w=majority`;
    conn = mongoose.createConnection(uri, {
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;

    // Declare all the models and store them agains the connection
    conn.model('users', new mongoose.Schema({ email: String }));
  }

  // Creates the Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });
  return new Promise((yay, nay) => {
    const cb = (err, args) => (err ? nay(err) : yay(args));
    server.createHandler()(event, context, cb);
  });
};