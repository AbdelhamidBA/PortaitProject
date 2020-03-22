const  mongoose = require('mongoose');
const User = require('../models/UserSchema');

exports.AddUser = async (req, res)=>{
    let add = {
        user_fullname: req.body.user_fullname,
        user_birthday: req.body.user_birthday,
        user_phone: req.body.user_phone,
        user_address: req.body.user_address,
        email: req.body.email,
        password: req.body.password,
        role : req.body.role
    }
    try {
        let user = new User(add);
        let addError = await user.validSchemaForm(add);
        if (addError.error == null) {
            let added = await user.save();
        }
        else {
            console.log(addError);
        }
    }
    catch(err){
        console.log(err);
    }
}