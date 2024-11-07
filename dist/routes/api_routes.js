import { Router } from 'express';
import { createUser, addUserNote, getUserNotesById, getAllNotes, deleteNoteForUser, addLikeToNote, getLikesForNote, } from '../controllers/api_controller.js';
const router = Router();
// Create a POST route that creates a user in the collection using your User model and sends back the user object as a JSON response
router.post('/users', createUser);
// Create a POST route that adds a note for a user
// The Request object comes from the client (a POST request in Insomnia for example), the Response object is what we send back
router.post('/note', addUserNote);
// Get a single user and their notes
router.get('/user/:user_id', getUserNotesById);
//GET all notes
router.get('/notes', getAllNotes);
// DELETE a note for a user
router.delete('/note/:note_id', deleteNoteForUser);
// PUT Add a like to a note
router.put('/note/like', addLikeToNote);
// GET Likes for a note
router.get('/note/likes', getLikesForNote);
export default router;
