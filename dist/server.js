import express from 'express';
import connection from './config/connection.js';
import api_routes from './routes/api_routes.js';
const app = express();
const PORT = process.env.PORT || 3333;
// Middleware
// This allows json to be attached to req.body in our routes
app.use(express.json());
// Load routes
// Base path will be localhost:3333/api
app.use('/api', api_routes);
connection.once('open', () => {
    app.listen(PORT, () => {
        console.log('Express server started on', PORT);
    });
});
