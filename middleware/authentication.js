const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        throw new CustomError.unauthenticatedError('authentication invalid')
    }
    try {
        const { firstName, userId, } = isTokenValid({ token });
        req.user = { firstName, userId, };
        next();
    } catch (error) {
        throw new CustomError.unauthenticatedError('authentication invalid')
    }

}

//authentication middleware firebase authentication in nodejs and mongodb?
// const {auth} = require('firebase-admin');
// const authService = auth();

// exports.requiresAuth = async (req, res, next) => {
//     const idToken = req.header('FIREBASE_AUTH_TOKEN');

//     // https://firebase.google.com/docs/reference/admin/node/admin.auth.DecodedIdToken
//     let decodedIdToken;

//     try {
//         decodedIdToken = await authService.verifyIdToken(idToken);
//     } catch (error) {
//         next(error);
//         return;
//     }

//     req.user = decodedIdToken;
//     next();
// }


// const express = require('express');
// const router = express.Router();
// const {requiresLogin} = require('./my-middleware.js');

// router.get('/example', requiresLogin, async (req, res) => {
//     console.log(req.user)
// })





module.exports = authenticateUser;