const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
const indexRoutes = require('./routes/index');
const filmsRoute = require('./routes/film_routes');
const adminRoute = require('./routes/admin_routes');
const signupRoute = require('./routes/SignUp_routes');
const feedbackRoute = require('./routes/feedback_routes');


const corsOptions = {
        origin: 'http://localhost:4200/',
        optionsSuccessStatus: 200
    }
    // Middlewares Routes Placed Here
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.use(express.json({ limit: '1000mb' }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use('/public', express.static('public'));
app.use('/', indexRoutes);
app.use('/api/feedback',feedbackRoute);
app.use('/api/film', filmsRoute);
app.use('/api/admin', adminRoute);
app.use('/api/signup', signupRoute); 
app.use(cors(corsOptions));
//Database Connection
mongoose.connect("mongodb://localhost:27017/Theater"
, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
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