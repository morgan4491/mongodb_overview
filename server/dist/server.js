import express from 'express';
import connection from './config/connection.js';
const app = express();
const PORT = process.env.PORT || 3333;
// app.get is creating a route for your server
app.get('/api/test', (_, res) => {
    res.json({
        message: 'Hi from server'
    });
});
// Create a POST route that creates a user in the collection using your User mode and sends back the user object as a JSON response
// Create a GET route that sends back all users from the collection
connection.once('open', () => {
    app.listen(PORT, () => {
        console.log('Express server started on', PORT);
    });
});
