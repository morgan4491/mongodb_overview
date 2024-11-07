import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema, model } = mongoose;
const { hash, compare } = bcrypt;
const userSchema = new Schema({
    email: {
        type: String,
        // The unique rule only works when the collection is FIRST CREATED
        // You CANNOT create a custom error message with the array syntax on the 'unique' rule
        unique: true,
        // Ensure the email contains the @ symbol
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        // Ensure the string is at least 6 characters long
        minLength: [6, 'Your password must be at least 6 characters in length'],
    },
    // The notes property is going to be an array of note ids from the notes collection
    notes: [{
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }]
}, {
    toJSON: {
        transform(_, user) {
            delete user.password;
            delete user.__v;
            return user;
        }
    }
});
// Encrypt the user's password before the user is saved to the users collection
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isNew) {
        user.password = await hash(user.password, 10);
    }
    next();
});
// Setup a validation function that we can use to check that a user's password if valid (formPassword vs encrypted password)
userSchema.methods.validatePassword = async function (formPassword) {
    return await compare(formPassword, this.password);
};
const User = model('User', userSchema);
export default User;
