const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const indexRoutes = require('./routes/index');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

// Middlewares Routes Placed Here
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));


app.use('/', indexRoutes);


//Database Connection
mongoose.connect('mongodb://localhost:27017/Theater', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', () => {
    console.log('Connection Error');
});

db.once('open', () => {
    console.log('Database Connected');
});


//Configure NodeServer To Connect on PORT
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is Running on Port: ${PORT}`);
});