const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");


//
require('dotenv').config();
//

//node mailer
async function mailer(receiverEmail, code) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: "codingbuggies@gmail.com", // generated ethereal user
            pass: "pisxdgqblxblanaa", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'codingbuggies@gmail.com', // sender address
        to: `${receiverEmail}`, // list of receivers
        subject: "SignUp verification", // Subject line
        text: `Your verification code is ${code}`, // plain text body
        html: `<b>Your verification code is ${code}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

router.post('/verify', (req, res) => {
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
                try {
                    let verificationCode = Math.floor(100000 + Math.random() * 900000)
                    let user = [
                        userName,
                        userEmail,
                        Password,
                        confirmPassword,
                        verificationCode
                    ]
                    await mailer(userEmail, verificationCode);
                    res.send({ message: "Verification Code sent to your Email", userdata: user });
                } catch (error) {
                    console.log('error =======>', error)
                }
            }
        )
})

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
            console.log('err', err)
            console.log('result', result)
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