const express = require('express')

const categoryRouter = express.Router()

const {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
} = require('../controller/categoryController')

categoryRouter
    .route('/')
    .get(getAllCategory)
    .post(createCategory)

categoryRouter
    .route('/:id')
    .get(getSingleCategory)
    .patch(updateCategory)
    .delete(deleteCategory)

module.exports = categoryRouter