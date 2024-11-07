import {Request, Response} from 'express';
import User from '../models/User.js';
import Note from '../models/Note.js';

export async function createUser(req: Request, res: Response) {
    try {
        // If req.body is the user's information(email, password), how do I use the model to create the user with req.body?
    const user = await User.create(req.body);

    res.json({
        message: 'Hi from server',
        user: user // This is the shorthand for user: user
    })
    } catch (error: any) {
        const errors: String[] = [];
        
        if (error.code === 11000) {
            errors.push('That email address is already in use');
        } else {
            for (const prop in error.errors) {
                errors.push(error.errors[prop].message);
            }
        }
        

        res.status(403).json({
            errors: errors
        });
    }
}

export async function addUserNote(req: Request, res: Response) {
    // req.body should have a user_id and text which is the text of the note

    // Find the user from the database, using the User model
    const user = await User.findById(req.body.user_id);
    const note = await Note.create({
        // These properties (text, user) are a reference to the noteSchema
        text: req.body.text,
        user: req.body.user_id
    });

    // Push a new note object/document to the user's notes array property
    user?.notes.push(note._id);

    await user?.save();

    res.json({
        user: user
    });
}

export async function getUserNotesById(req: Request, res: Response) {
    const user_id = req.params.user_id;

    // Create a variable that stores the user we find by id
    const user = await User.findById(user_id).populate('notes');

    // Send a json response back to the client with the user attached
    res.json({
        user: user
    })
}

export async function getAllNotes(_: Request, res: Response) {
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
    res.json(notes);
}


export async function deleteNoteForUser(req: Request, res: Response) {
    const note_id = req.params.note_id;
    const user_id = req.body.user_id;
    
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

    res.json({
        message: 'Note removed successfully!'
    })
}

export async function addLikeToNote(req: Request, res: Response) {
    const note_id = req.body.note_id;
    const user_id = req.body.user_id;
    
    await Note.findByIdAndUpdate(note_id, {
        $push: {
            likes: {
                user: user_id
            }
        }
    });


    // This version would present to you the updated note with the like
    // const udpateNote = await Note.findByIdAndUpdate(note_id, {
    //     $push: {
    //         likes: {
    //             user: user_id
    //         }
    //     }
    // }, {
    //     new: true
    // });


    res.json({
        message: 'Like added successfully!'
    })
}

export async function getLikesForNote(req: Request, res: Response) {
    const note_id = req.body.note_id;
    
    const note = await Note.findById(note_id).populate({
        path: 'likes',
        populate: {
            path: 'user',
            select: 'email'
        }
    });

    res.json({
        count: note?.likes.length,
        likes: note?.likes
    });    
}