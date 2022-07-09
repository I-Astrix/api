const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String
    },
    image:{
        type: String,
        default: 'https://res.cloudinary.com/dknupld0a/image/upload/v1655891890/Other%20Assets/download_u0exhm.png'
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
    
}, {timestamps: true})

module.exports = new mongoose.model('User', UserSchema);