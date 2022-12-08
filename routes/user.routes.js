const express = require('express');
const userRoute = express.Router();

const {
    register,
    fetchAllUser,
    fetchCurrentId
} = require('../controller/userController');

userRoute.route('/addUser').post(register);

userRoute.route('/fetchAll').get(fetchAllUser);

userRoute.route('/fetchCurrent/:id').get(fetchCurrentId);

module.exports = userRoute