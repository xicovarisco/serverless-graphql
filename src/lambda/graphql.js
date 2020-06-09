import mongoose from 'mongoose';
import Database from './db';
import models from './models';
const { Schema } = mongoose;
// const Users = mongoose.model('Users');
const { ApolloServer, gql } = require("apollo-server-lambda");

let conn = null;
const { dbUser, dbPassword, dbName } = process.env;
const uri = `mongodb+srv://${dbUser}:${dbPassword}@prod-cluster-mhiuv.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// const typeDefs = gql`
//   type Users {
//     _id: ID!
//     email: String
//   }
//   type Query {
//     hello: String
//     fetchUsers: [Users]
//   }
// `;

// const resolvers = {
//     Query: {
//         hello: (parent, args, context) => {
//             return "Hello, world!";
//         },
//         fetchUsers: () => {
//           console.log('test');
//             return Users.find();
//         }
//     }
// };

const UserSchema = new Schema({
  email: String,
}, { collection: 'users' });

exports.handler = async (event, context) => {
  // await Database.connect();
  // const server = new ApolloServer({
  //   typeDefs,
  //   resolvers
  // });
  // return new Promise((yay, nay) => {
  //   const cb = (err, args) => (err ? nay(err) : yay(args));
  //   server.createHandler()(event, context, cb);
  // });


  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  // Because `conn` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
  if (conn == null) {
    console.log('uri', uri);
    conn = mongoose.createConnection(uri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;
    // conn.model('Users', new mongoose.Schema({ name: String }));

    conn.model('Users', UserSchema);
  }

  const M = conn.model('Users');
  console.log('M', M);
  const doc = await M.find();
  console.log('test', doc);

  return doc;
};