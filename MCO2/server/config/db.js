const mongoose = require('mongoose')
const connectDB = async () => {
    try{
    const conn = await mongoose.connect('mongodb://127.0.0.1/reservationsDB');
    console.log('Connected to MongoDB');
    } catch(error)  {
    console.error('Error connecting to MongoDB:', error.message);

    // Handle specific error conditions
    if (error.name === 'MongoNetworkError') {
        console.error('Network error occurred. Check your MongoDB server.');
    } else if (error.name === 'MongooseServerSelectionError') {
        console.error('Server selection error. Ensure'
            + ' MongoDB is running and accessible.');
    } else {
        // Handle other types of errors
        console.error('An unexpected error occurred:', error);
    }
}};

module.exports = connectDB;