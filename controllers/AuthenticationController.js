const jwt = require('jsonwebtoken');
const mongosse = require('mongoose');
const User = require('../models/UserSchema');


exports.RegisterUser = async(req, res) => {
    let add = {
        user_fullname: req.body.user_fullname,
        user_birthday: req.body.user_birthday,
        user_phone: req.body.user_phone,
        user_address: req.body.user_address,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }
    let user = new User(add);

    try {
        let addError = await user.validSchemaForm(add);
        if (addError.error == null) {
            let added = await user.save();
            if (Object.keys(added).length != 0) {
                console.log(added._id);
                let payload = { subject: added._id }
                let token = jwt.sign(payload, 'TheaterSecertKey')
                res.json({
                    token: token,
                    message: `${added.user_fullname} is Successfully Added`,
                    error: false
                });
            }
        } else {
            //res.render
            res.json({
                token: null,
                message: `${addError.error}`,
                errpr: true
            });
        }
    } catch (err) {
        res.json({
            token: null,
            message: `${err}`,
            error: true
        });
    }
}


exports.login = async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log("email:" + email);
    try {
        let found = await User.findOne({
            email: email,
            password: password
        });

        if (Object.keys(found).length != 0) {
            console.log("hello");
            let payload = { subject: found._id }
            console.log(payload);
            let token = jwt.sign(payload, 'TheaterSecertKey');
            console.log(token);
            res.json({
                user: { _id: found._id, fullname: found.user_fullname, email: found.email, role: found.role, token: token },
                message: 'User Successfully Logged In',
                error: false
            });
        } else {
            res.json({
                user: null,
                message: 'Check Your Email & Password and Try Again',
                error: false
            });
        }
    } catch (err) {
        res.json({
            user: null,
            message: err,
            error: true
        });
    }
}