const express = require('express');
const userRoute = express.Router();

const user = require('../model/user.model')
userRoute.post('/addUser', async(req,res)=>{
    console.log('gebtual')
const newUSer = user({
    FirstName :  req.body.FirstName,
    LastName: req.body.LastName
});
await newUSer.save();
return res.status(200).json(newUSer)
})

userRoute.get('/fetchAll', async(req,res)=>{
    
    const fetched = await user.find();
    return res.json({
        "users":fetched
    });
})


module.exports = userRoute