import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: String,
}, { collection: 'users' });

mongoose.model('Users', UserSchema);
