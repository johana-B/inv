const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        trim: true

    },
    LastName: {
        type: String,
        required: true,
        trim: true

    },
    role: {
        type: String,
        default: 'admin'
    },
    uid: {
        type: String,
        required: true
    }
});


const userSChema = mongoose.model('user schema', UserSchema)
module.exports = userSChema;
