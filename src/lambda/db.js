import mongoose from 'mongoose';
require('dotenv').config();

const { dbUser, dbPassword, dbName } = process.env;
console.log('dbUser', dbUser);
const Database = {
    client: null,
    connect: async () => {
        // Check if database connection is opened already
        if (Database.client) return true;

        mongoose.Promise = global.Promise;
        mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@prod-cluster-mhiuv.mongodb.net/${dbName}?retryWrites=true&w=majority`, { useNewUrlParser: true });
        Database.client = true;
        mongoose.connection
            .once('open', () => console.log('Connected to MongoLab instance.'))
            .on('error', error => console.log('Error connecting to MongoLab:', error));
    }
};

export default Database;
