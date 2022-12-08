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
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = bcrypt.hash(salt, this.password)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

const userSChema = mongoose.model('user schema', UserSchema)
module.exports = userSChema;
