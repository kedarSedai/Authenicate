const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const{registerValidation, loginValidation } = require('../validation');

const User = require('../model/User');

//db configuration
const dbSecret = require('../setup/myUrl').secret

//Router for register
router.post('/register', async (req,res) => {

    //Validate before User
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if email exists
    const existEmail = await User.findOne({email: req.body.email});
    if(existEmail) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Create new user
    const user = new User({
       name: req.body.name,
       email: req.body.email,
       password: hashedPassword
   });
   try{
        const saveUser = await user.save();
        // //Sending whole user like password, email , username instead
        // res.json(saveUser);
        // but we can send it by id
        res.json({user: user._id});

   }catch(err){
       res.send(err);
   }
});

//Router for login 
router.post('/login', async (req, res) =>{
     //Validate before User
     const {error} = loginValidation(req.body);
     if(error) return res.status(400).send(error.details[0].message);

      //Checking if email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found');

    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Create and assign a token
    // const token = jwt.sign({_id: user._id}, dbSecret);
    // res.header('auth-token', token).send(token);

     res.send('Logged in');
});

module.exports = router;