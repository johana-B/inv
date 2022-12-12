const express = require('express')

const subCategoryRouter = express.Router()
const { FirebaseAuthentication } = require('../middleware/authentication');
const {
    createSubCategory,
    getAllSubCategories,
    getSingleSubCategory,
    updateSubCAtegory,
    deleteSubCategory
} = require('../controller/subCategoryController');



subCategoryRouter
    .route('/')
    .get(FirebaseAuthentication, getAllSubCategories)
    .post(FirebaseAuthentication, createSubCategory);

subCategoryRouter
    .route('/:id')
    .get(FirebaseAuthentication, getSingleSubCategory)
    .patch(FirebaseAuthentication, updateSubCAtegory)
    .delete(FirebaseAuthentication, deleteSubCategory);

module.exports = subCategoryRouter