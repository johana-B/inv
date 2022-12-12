const express = require('express')

const categoryRouter = express.Router()
const { FirebaseAuthentication } = require('../middleware/authentication');
const {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
} = require('../controller/categoryController')

categoryRouter
    .route('/')
    .get(FirebaseAuthentication, getAllCategory)
    .post(FirebaseAuthentication, createCategory)

categoryRouter
    .route('/:id')
    .get(getSingleCategory)
    .patch(updateCategory)
    .delete(deleteCategory)

module.exports = categoryRouter