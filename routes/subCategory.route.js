const express = require('express')

const subCategoryRouter = express.Router()

const {
    createSubCategory,
    getAllSubCategories,
    getSingleSubCategory,
    updateSubCAtegory,
    deleteSubCategory
} = require('../controller/subCategoryController');



subCategoryRouter
    .route('/')
    .get(getAllSubCategories)
    .post(createSubCategory);

subCategoryRouter
    .route('/:id')
    .get(getSingleSubCategory)
    .patch(updateSubCAtegory)
    .delete(deleteSubCategory);

module.exports = subCategoryRouter