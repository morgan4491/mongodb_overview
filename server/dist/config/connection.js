import mongoose from "mongoose";
mongoose.connect('mongodb://127.0.0.1:27017/mongodb_practice_app_db'); // The end part is the database name. If it does not exist, it will be created
export default mongoose.connection;
