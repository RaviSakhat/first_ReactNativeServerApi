const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // console.log(authorization);  
    if (!authorization) {
        return res.status(401).send({ error: "You must logged in" })
    }
    const token = authorization.replace("Bearer", "");
    console.log(token);
    jwt.verify(token, process.env.jwt_secret, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in, token invalid" });
        }
        const { _id}  = payload;
        console.log('_id', _id)
        User.findById(_id).then(userdata => {
            req.user = userdata;
            res.send(req.user);
            next();
        })
    })
}   