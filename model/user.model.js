const mongoose = require('mongoose');
const user = mongoose.Schema({
    FirstName:{
        type:String,
        required: true,
        trim:true
        
    },
    LastName:{
        type:String,
        required:true,
        trim:true 
        
    }
});

const userSChema = mongoose.model('user schema', user)
module.exports = userSChema;
