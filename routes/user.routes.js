const express = require('express');
const userRoute = express.Router();
const { FirebaseAuthentication } = require('../middleware/authentication');
const {
    register,
    fetchAllUser,
    fetchCurrentId
} = require('../controller/userController');

userRoute.route('/addUser').post(register);

userRoute.route('/fetchAll').get(fetchAllUser);

userRoute.route('/fetchCurrent/:id').get(FirebaseAuthentication, fetchCurrentId);

module.exports = userRoute