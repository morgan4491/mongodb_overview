import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    _id: false // This option removes the _id from the like
});
const noteSchema = new Schema({
    text: {
        type: String,
        minLength: [3, 'Your note must be at least 3 characters in length']
    },
    user: {
        type: Schema.Types.ObjectId,
        // This is a reference to the model name you declared in the User model file, through model('User', userSchema)
        ref: 'User'
    },
    likes: [likeSchema]
});
const Note = model('Note', noteSchema);
export default Note;
