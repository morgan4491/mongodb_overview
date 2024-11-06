import express, {Request, Response} from 'express';
import connection from './config/connection.js';
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 3333;


// Middleware
// This allows json to be attached to req.body in our routes
app.use(express.json())

// app.get is creating a route for your server

// Create a POST route that creates a user in the collection using your User mode and sends back the user object as a JSON response
app.post('/api/users', async (req: Request, res: Response) => {

    try {
        // If req.body is the user's information(email, password), how do I use the model to create the user with req.body?
    const user = await User.create(req.body);

    res.json({
        message: 'Hi from server',
        user // This is the shorthand for user: user
    })
    } catch (error: any) {
        const errors: string[] = [];
        
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
});



// Create a POST route that adds a note for a user
app.post('/api/note', async (req: Request, res: Response) => {
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
});


// Get a single user and their notes
app.get('/api/user/:user_id', async (req: Request, res: Response) => {

    const user_id = req.params.user_id;

    // Create a variable that stores the user we find by id
    const user = await User.findById(user_id);

    // Send a json response back to the client with the user attached
    res.json({
        user: user
    })
});


connection.once('open', () => {
    app.listen(PORT, () => {
        console.log('Express server started on', PORT);
    })
});
