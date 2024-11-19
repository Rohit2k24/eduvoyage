const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 
const indexRoutes = require('./routes/indexRoutes');
const studentroute=require('./routes/studentRoutes');
const app = express();


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};
const session = require('express-session');

app.use(session({
  secret: process.env.JWT_SECRET, // replace with your actual secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // set to true if using HTTPS
}));

connectDB();

app.use('/api', indexRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
