import User from '../models/User.js';
export async function createUser(req, res) {
    try {
        // If req.body is the user's information(email, password), how do I use the model to create the user with req.body?
        const user = await User.create(req.body);
        res.json({
            message: 'Hi from server',
            user: user // This is the shorthand for user: user
        });
    }
    catch (error) {
        const errors = [];
        if (error.code === 11000) {
            errors.push('That email address is already in use');
        }
        else {
            for (const prop in error.errors) {
                errors.push(error.errors[prop].message);
            }
        }
        res.status(403).json({
            errors: errors
        });
    }
}
export async function addUserNote(req, res) {
    // req.body should have a user_id and text which is the text of the note
    // Find the user from the database, using the User model
    const user = await User.findById(req.body.user_id);
    // Push a new note object/document to the user's notes array property
    user?.notes.push({
        text: req.body.text
    });
    await user?.save();
    res.json({
        user: user
    });
}
export async function getUserNotesById(req, res) {
    const user_id = req.params.user_id;
    // Create a variable that stores the user we find by id
    const user = await User.findById(user_id);
    // Send a json response back to the client with the user attached
    res.json({
        user: user
    });
}
