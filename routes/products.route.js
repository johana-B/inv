const express = require('express')

const router = express.Router()

const { authenticateUser } = require('../middleware/authentication');

const {
    getAllProducts,
    getSoldPrice,
    getSoldProduct,
    getTotalProfit,
    getTotalStock,
    createProduct,
    updateProduct,
    deleteProduct,
    soldProducts
} = require('../controller/productController');

router
    .route('/')
    .post(authenticateUser, createProduct)
    .get(getAllProducts)

router
    .route('/:id')
    .patch(updateProduct)
    .delete(deleteProduct)

router
    .route('/totalProfit')
    .get(getTotalProfit)

router
    .route('/soldProduct')
    .get(getSoldProduct)

router
    .route('/soldprice')
    .get(getSoldPrice)

router
    .route('/totalStock')
    .get(getTotalStock)

router
    .route('/soldPro/:id')
    .patch(soldProducts)


module.exports = router