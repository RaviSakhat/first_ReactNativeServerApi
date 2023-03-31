const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        requird: true,
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    }
})

mongoose.model("User", userSchema)