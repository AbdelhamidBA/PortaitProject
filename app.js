const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const indexRoutes = require('./routes/index');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use('/', indexRoutes);

mongoose.connect('mongodb://localhost:27017/MovieTheater', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', () => {
    console.log('Connection Error');
});

db.once('open', () => {
    console.log('Database Connected');
});


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is Running on Port: ${PORT}`);
});