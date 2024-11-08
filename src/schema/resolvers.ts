import User from '../models/User.js';
import Note from '../models/Note.js';

const resolvers = {
    // In GraphQL you are REQUIRED to make at least ONE query function
    Query: {
        async getUserNotesById(_: any, args: { user_id: string }) {
            const user_id = args.user_id;

            // Create a variable that stores the user we find by id
            const user = await User.findById(user_id).populate({
                path: 'notes',
                select: 'text'
            });

            // const user = await User.findById(user_id).select('email -_id');

            // Send a json response back to the client with the user attached
            return user;
        },
        async getAllNotes() {
            // Find all notes and populate the user property on each note
            // const notes = await Note.find().populate('user');

            // Populate the sub property or child propert of the user object
            const notes = await Note.find().populate({
                path: 'user',
                populate: {
                    path: 'notes'
                }
            });

            // Send back the notes in a json response
            return notes;
        },
        async getLikesForNote (_: any, args: { note_id: string }) {
            const note_id = args.note_id;

            const note = await Note.findById(note_id).populate({
                path: 'likes',
                populate: {
                    path: 'user',
                    select: 'email'
                }
            });

            return note?.likes;
        }
    },

    Mutation: {
        async createUser(_: any, args: { email: string; password: string }) {
            try {
                // If req.body is the user's information(email, password), how do I use the model to create the user with req.body?
                const user = await User.create(args);

                return {
                    user: user
                };
            } catch (error: any) {
                const errors: String[] = [];

                if (error.code === 11000) {
                    errors.push('That email address is already in use');
                } else {
                    for (const prop in error.errors) {
                        errors.push(error.errors[prop].message);
                    }
                }


                return {
                    errors: errors
                };
            }
        },

        async addUserNote(_: any, args: { user_id: string, text: string }) {
            // req.body should have a user_id and text which is the text of the note

            // Find the user from the database, using the User model
            const user = await User.findById(args.user_id);
            const note = await Note.create({
                // These properties (text, user) are a reference to the noteSchema
                text: args.text,
                user: args.user_id
            });

            // Push a new note object/document to the user's notes array property
            user?.notes.push(note._id);

            await user?.save();

            return user;
        },
        async deleteNoteForUser(_: any, args: { note_id: string, user_id: string }) {
            const note_id = args.note_id;
            const user_id = args.user_id;

            // Delete the note
            await Note.deleteOne({
                _id: note_id
            });

            // Find a user and remove the note id from their notes array
            await User.findByIdAndUpdate(user_id, {
                $pull: {
                    notes: note_id
                }
            })

            return 'Note deleted successfully';
        },
        async addLikeToNote(_: any, args: { note_id: string, user_id: string }) {
            const note_id = args.note_id;
            const user_id = args.user_id;

            await Note.findByIdAndUpdate(note_id, {
                $push: {
                    likes: {
                        user: user_id
                    }
                }
            });

            return 'Like added successfully!';
        }
    }
};

export default resolvers;