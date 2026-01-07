const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('UW-Estimathon API is running...');
});

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
if (mongoURI) {
    mongoose.connect(mongoURI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log('MongoDB connection error:', err));
} else {
    console.log('MONGODB_URI not found in .env, skipping connection for now.');
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
