const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    },
    verificationCode: {
        type: String,
        required: true,
    }
})

userSchema.pre('save', async function (next){
    const user = this;
    console.log("Just before saving ",user)
    if(!user.isModified('Password') && !user.isModified('confirmPassword')){
        return next();
    }
    user.Password = await bcrypt.hash(user.Password, 8);
    user.confirmPassword = await bcrypt.hash(user.confirmPassword, 8);
    console.log('Just before saving && after hashing', user)
    next();
})

mongoose.model("User", userSchema)