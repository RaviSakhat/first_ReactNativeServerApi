const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//
require('dotenv').config();
//


router.post('/signup', (req, res) => {
    // res.send("This is SignUp Page");
    console.log(req.body);
    const { userName, userEmail, Password, confirmPassword } = req.body;
    if (!userName || !userEmail || !Password || !confirmPassword) {
        return res.status(422).send({ error: "Please fill all the fields" });
    }
    User.findOne({ userEmail: userEmail })
        .then(
            async (savedUser) => {
                if (savedUser) {
                    return res.status(422).send({ error: "Invalid Credentials" });
                }
                const user = new User({
                    userName,
                    userEmail,
                    Password,
                    confirmPassword
                })
                try {
                    await user.save();
                    const token = jwt.sign({ _id: user._id }, process.env.jwt_secret);
                    res.send({ token });
                } catch (err) {
                    console.log('err======>', err)
                    return res.status(422).send({ error: err.message })
                }
            }
        )
})

router.post('/signin', async (req, res) => {
    const { userEmail, Password } = req.body;
    if (!userEmail || !Password) {
        return res.status(422).json({ error: "Please add email or password" });
    }
    const savedUser = await User.findOne({ userEmail })

    if (!savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" });
    }

    try {
        bcrypt.compare(Password, savedUser.Password, (err, result) => {
            console.log('err',err)
            console.log('result',result)
            if (result) {
                console.log("Password matched");
                const token = jwt.sign({ _id: savedUser._id }, process.env.jwt_secret);
                res.send({ token });
            }
            else {
                console.log('Password does not match');
                return res.status(422).json({ error: "Invalid Credentials" });
            }
        })
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;