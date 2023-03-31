const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

//
require('dotenv').config();
//


router.post('/signup', (req, res) => {
    res.send("This is SignUp Page");
    console.log(req.body);
    const { userName, userEmail, Password, confirmPassword  } = req.body;
    if(!userName || !userEmail || !Password || !confirmPassword){
        return res.status(422).send({error: "Please fill all the fields"});
    }
    User.findOne({ userEmail: userEmail})
    .then(
        async(savedUser) => {
            if(savedUser){
                return res.status(422).send({error: "Invalid Credentials"});
            }
            const user = new User({
                userName,   
                userEmail,
                Password,
                confirmPassword
            })
            try {
                await user.save();
                const token = jwt.sign({_id: user._id}, process.env.jwt_secret);    
                res.send({token});
            } catch (err) {
                console.log('err======>', err)
                return res.status(422).send({error: err.message})   
            }
        }
    )
})

module.exports = router;