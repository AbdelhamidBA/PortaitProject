const mongoose = require('mongoose');
const Joi = require('joi');
const User = require('../models/UserSchema');

exports.getAllUsers = async (req,res)=>{
    try{
        let all = await User.find();
            if(all != null){
                //res.render
                res.json(all);
            }
        }
    catch(err){
        res.json({message: err});
    }
}

exports.getUserByID = async (req,res)=>{
    try{
    let idUser = req.params.idUser;
    if(idUser == null || idUser < 24){
        res.json({message: err});
    }
    else{
        let resultat = await User.findById(idUser);
        if(resultat != null){
        //res.render
            res.send(resultat);
        }
        else{
            console.log('pas de user');
            res.writeHead(404);
        }
    }

}
catch(err){
    console.log({message: err});
}
}

exports.getUserByEmail = async (req,res)=>{
   try{
        let email = req.query.email;
        let emailSchema = Joi.string().trim().email();
        let test = await Joi.validate(email,emailSchema)
        /*console.log('here');
        console.log(test);*/
        if(test.error !== null){
            let allUser = await User.find()
            .where ('email').equals(email);
            if(Object.keys(allUser).length !== 0){
                res.json(allUser);
            }
        }
        else{
            res.send(test);
        }
        console.log(test);
    }
    catch(err){
        //console.log({message: err});
        if(err.message != null || err.message !=='')
         {
            res.sendStatus(404);
         }
         else
         {
             console.log(err);
             res.send('une erreur se produit');
         }
    }
}

exports.getUserByRole = async (req,res)=>{
    try{
         let role = req.body.role;
         let roleSchema = Joi.string().trim();
         let validRole = await Joi.validate(role,roleSchema);
         if(validRole !== null){
            let allUser = await User.find()
            .where ('role').equals(role);
            if(Object.keys(allUser).length !== 0){
                res.json(allUser);
            }
            else{
                res.json({message :"email dosent exist"});

            }
         }
         else{
             res.send(validRole);
         }
     }
     catch(err){
        if(err.message != null || err.message !=='')
        {
           res.sendStatus(404);
        }
        else
        {
            console.log(err);
            res.send('une erreur se produit');
        }
     }
 }

exports.AddUser = async (req,res)=>{
    let add = {
        user_fullname: req.body.user_fullname,
        user_birthday: req.body.user_birthday,
        user_phone: req.body.user_phone,
        user_address: req.body.user_address,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }
    console.log(add);
    let user = new User(add);

    try{
        let addError = await user.validSchemaForm(add);
        if(addError.error == null){
            let added = await user.save();
        }
        else{
            //res.render
             console.log(addError);
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.DeleteUser = async (req,res)=>{
    try{
        let idUser = req.params.idUser;
        if(idUser != null){
            let resultat = await User.findByIdAndDelete(idUser);
            res.json(resultat);
        }
        else{
            console.error();
        }
    }
    catch(err){
        res.json({message: err});

    }

}

exports.UpdateUser = async (req,res)=>{

        let idUser = req.params.idUser;
        let updated = req.body;
        let user = new User();
        try{
        if(idUser != null){
            let updatedError = await user.validSchemaForm(updated);
            if(updatedError.error == null){

                    let up = await User.findByIdAndUpdate(idUser,{$set : updated });
                    if(Object.keys(up).length !== 0)
                    {
                        console.log('done');
                    }
                    else
                    {
                        console.log('sorry');
                    }
                res.json(up);
            }
            else{
                console.log(updatederror);
            }
        }
        else{
            console.log('no user found');
        }
        }
        catch (err){
            res.json({message: err});
            //console.log('erreur');
        }
}